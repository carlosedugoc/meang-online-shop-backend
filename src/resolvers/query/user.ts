import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../../config/constants';
import JWT from '../../lib/jwt';
import { IUser } from '../../interfaces/user.interface';
import bcrypt from 'bcrypt';
import { findOneElement } from '../../lib/db-operations';


interface UserResponse {
  status: boolean;
  message: string;
  users?: IUser[] | null;
}

interface LoginResponse {
  status: boolean;
  message: string;
  token?: string | null;
}

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, { db }): Promise<UserResponse> {
      try {
        return {
          status: true,
          message: 'Usuarios cargados correctamente',
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        return {
          status: false,
          message: `Ha ocurrido el siguiente error: ${error}`,
          users: [],
        };
      }
    },

    async login(_, { email, password }, { db }){
      try {
        const user = await findOneElement(db, COLLECTIONS.USERS, {email});
        if (!user)
          return {
            status: false,
            message: 'Usuario No Existe',
            token: null,
          };
        
        const passwordCheck: boolean = bcrypt.compareSync(password, user.password)
        
        if(passwordCheck){
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }
        return {
          status: passwordCheck ? true : false,
          message: passwordCheck ? 'Usuario logueado correctamente' : 'Usuario o Password incorrectos',
          token: passwordCheck ? new JWT().sign({ user }, EXPIRETIME.H24) : null,
        };
      } catch (error) {
        return {
          status: false,
          message: `Ha ocurrido el siguiente error: ${error}`,
          token: null,
        };
      }
    },

    async me(_, __, { token }){
      console.log(token)
      let info = new JWT().verify(token);
      if (info === MESSAGES.TOKEN_VERIFICATION_FAILED){
        return {
          status: false,
          message: info,
          user:null
        } 
      }
      return {
        status: true,
        message: "Usuario autenticado correctamente",
        user: Object.values(info)[0]
      }
    }
  },
};

export default resolversUserQuery;