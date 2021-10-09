import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { IContextData } from "../interfaces/context-data";
import { findOneElement, updateOneElement } from '../lib/db-operations';
import { ResolversOperationService } from "./resolvers-operations.service";
import { IMailOptions } from '../interfaces/email.interface';
import MailService from "./mail.service";
import JWT from "../lib/jwt";
import bcrypt from 'bcrypt';

class PasswordService extends ResolversOperationService {
    collection = COLLECTIONS.USERS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async sendEmail() {
        const email = this.getVariables().user?.email
        if(!email) return {status: false, message: 'El EMail no se ha definido'}
        const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {email})
        if (!user) {
            return {
                status: false,
                message: `Usuario con el email ${email} no existe`
            }
        }
        const newUser = {
            id: user.id,
            email: user.email
        }
        const token = new JWT().sign({user: newUser}, EXPIRETIME.M15)
        const html = `Para cambiar la contraseña haz <a href="${process.env.CLIENT_URL}/#/reset/${token}">click aquí</a>`
        const mail: IMailOptions = {
            subject: 'Cambiar Contraseña',
            to: email,
            html
        }
        return new MailService().send(mail);
    }


    async change() {
        const id = this.getVariables().user?.id
        let password = this.getVariables().user?.password
        if(!id) return {status:false, message: 'El ID es necesario'}
        if(!password || password === '1234') return {status:false, message: 'El password es necesario'}

        password = bcrypt.hashSync(password, 10)

        const result = await this.update(COLLECTIONS.USERS,{id}, {password}, 'users')
        return {
            status: result.status,
            message: (result.status) ? 'Contraseña cambiada correctamente' : result.message
        }
    }
}

export default PasswordService