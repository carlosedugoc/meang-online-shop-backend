import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../../config/constants';
import { transport } from '../../config/mailer';
import JWT from '../../lib/jwt';
import UserService from '../../services/user.service';
import { findOneElement, updateOneElement } from '../../lib/db-operations';
import bcrypt from 'bcrypt';
import MailService from '../../services/mail.service';
import { IMailOoptions } from '../../interfaces/email.interface';
import PasswordService from '../../services/password.service';

const resolversMailMutation: IResolvers = {
    Mutation: {
        async sendEmail(_,{mail}){
            return new MailService().send(mail)
        },

        async activeUserEmail(_,{id, email}) {
            return new UserService(_, {user:{id, email}}, {} ).active()
        },

        async activeUserAction(_, {id, birthday, password}, {token, db}) {
            const verify = verifyToken(token, id);
            if(verify?.status === false) return {status:false, message: verify.message}
            return new UserService(_, {id, user:{birthday, password}}, {token,db}).unblock(true)
        },

        async resetPassword(_, {email}, {db}) {
            return new PasswordService(_,{user:{email}}, {db}).sendEmail()
        },

        async changePassword(_, {id, password}, {db, token}) {
            const verify = verifyToken(token, id);
            if(verify?.status === false) return {status:false, message: verify.message}
            return new PasswordService(_, {user:{id, password}}, {db}).change()
        }
    }
};

function verifyToken(token: string, id: string){
    const checkToken = new JWT().verify(token);
    if(checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED){
        return {
            status: false,
            message: 'El periodo para activar el usuario a finalizado'
        }
    }
    const user = Object.values(checkToken)[0]
    if(user.id !== id) {
        return {
            status: false,
            message: 'El token no corresponde con el enviado en el argumento'
        }
    }
}

export default resolversMailMutation