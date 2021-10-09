import { ResolversOperationService } from "./resolvers-operations.service";
import { IContextData } from '../interfaces/context-data';
import { ACTIVE_VALUES_FILTER, COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { findOneElement, asignDocumentId } from '../lib/db-operations';
import bcrypt from 'bcrypt';
import JWT from "../lib/jwt";
import { IUser } from '../interfaces/user.interface';
import { IMailOptions } from "../interfaces/email.interface";
import MailService from "./mail.service";

class UserService extends ResolversOperationService {
    private collection: string = COLLECTIONS.USERS
    constructor(root:object, variables:object, context:IContextData) {
        super(root, variables, context)
    }

    public async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE){
      const page = this.getVariables().pagination?.page
      const itemsPage = this.getVariables().pagination?.itemsPage
      let filter: object = {active: {$ne:false}}
      if (active ===  ACTIVE_VALUES_FILTER.ALL) filter = {}
      if (active ===  ACTIVE_VALUES_FILTER.INACTIVE) filter = {active: false}
      const result = await this.list(this.collection, 'usuarios', page, itemsPage, filter)
      const {status, message, items: users, info} = result
      return { info, status, message, users }
    }

    async login() {
        try {
          const variables: IUser = this.getVariables().user!;
          const user = await findOneElement(this.getDb(), this.collection, {
            email: variables?.email,
          });
          if (user === null) {
            return {
              status: false,
              message: 'Usuario no existe',
              token: null,
            };
          }
          const passwordCheck = bcrypt.compareSync(
            variables?.password || '',
            user?.password
          );
    
          if (passwordCheck !== null) {
            delete user?.password;
            delete user?.birthday;
            delete user?.registerDate;
          }
          return {
            status: passwordCheck,
            message: !passwordCheck
              ? 'Password y usuario no son correctos, sesión no iniciada'
              : 'Usuario cargado correctamente',
            token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
            user: !passwordCheck ? null : user,
          };
        } catch (error) {
          return {
            status: false,
            message:
              'Error al cargar el usuario. Comprueba que tienes correctamente todo.',
            token: null,
          };
        }
    }

    async auth() {
        let info = new JWT().verify(this.getContext().token!);
        if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
          return {
            status: false,
            message: info,
            user: null,
          };
        }
        return {
          status: true,
          message: 'Usuario autenticado correctamente mediante el token',
          user: Object.values(info)[0],
        };
    }

    async register() {
      const user = this.getVariables().user;
  
      // comprobar que user no es null
      if (user === null) {
        return {
          status: false,
          message: 'Usuario no definido, procura definirlo',
          user: null,
        };
      }
      if (
        user?.password === null ||
        user?.password === undefined ||
        user?.password === ''
      ) {
        return {
          status: false,
          message: 'Usuario sin password correcto, procura definirlo',
          user: null,
        };
      }
      // Comprobar que el usuario no existe
      const userCheck = await findOneElement(this.getDb(), this.collection, {
        email: user?.email,
      });
  
      if (userCheck) {
        return {
          status: false,
          message: `El email ${user?.email} está registrado y no puedes registrarte con este email`,
          user: null,
        };
      }
  
      // COmprobar el último usuario registrado para asignar ID
      user!.id = await asignDocumentId(this.getDb(), this.collection, {
        registerDate: -1,
      });
      // Asignar la fecha en formato ISO en la propiedad registerDate
      user!.registerDate = new Date().toISOString();
      // Encriptar password
      user!.password = bcrypt.hashSync(user!.password, 10);
  
      const result = await this.add(this.collection, user || {}, 'usuario');
      // Guardar el documento (registro) en la colección
      return {
        status: result.status,
        message: result.message,
        user: result.item,
      };
    }

    async modify() {
      const userToModify = this.getVariables().user
      if(!userToModify) {
        return {
          status: false,
          message: 'Usuario no definido, procura definirlo',
          user: null,
        };
      }
      const filter = {id:userToModify?.id}
      const result = await this.update(this.collection, filter, userToModify!, 'usuario')
      const {status, message, item: user} = result
      return { status, message, user }
      
    }

    async delete(){
      const id = this.getVariables().id
      if (!id){
        return {
          status: false,
          message: 'Identificador del usuario no definido',
          user: null,
        }
      }
      return await this.del(this.collection, {id}, 'usuario')
    }


  public async unblock(unblock: boolean, admin: boolean){
    const id = this.getVariables().id
    const user = this.getVariables().user;
    if(!this.checkData(String(id) || '')){
        return {
            status: false,
            message: 'El ID del género no se ha especificado correctamente',
            user: null
        }
    }
    if(user?.password === '1234'){
      return {
        status: false,
        message: 'Debes cambiar el password',
      }
    }
    let update = {active: unblock, admin}
    if(unblock && !admin){
      update = Object.assign({}, {active: true, admin}, 
        {
          birthday: user?.birthday, 
          password: bcrypt.hashSync(user?.password!, 10)
        })
    }
    const result = await this.update(this.collection, {id}, update, 'usuario' )
    const action = (unblock) ? 'Desbloqueado' : 'Bloqueado'
    const {status} = result
    return { status, message: status ? `${action} Correctamente` : `No se ha ${action.toLowerCase()}` }
  }

  async active() {
    const id = this.getVariables().user?.id;
    const email = this.getVariables().user?.email;
    if(!email) return {status: false, message: 'El EMail no se ha definido'}
    const token = new JWT().sign({user: {id, email}}, EXPIRETIME.H1)
    const html = `Para activar la cuenta haz <a href="${process.env.CLIENT_URL}/#/active/${token}">click aquí</a>`
    const mail: IMailOptions = {
        subject: 'Activar Usuario',
        to: email,
        html
    }
    return new MailService().send(mail)
  }

  private checkData(value: string) {
    return (!value) ? false : true
  }

}

export default UserService