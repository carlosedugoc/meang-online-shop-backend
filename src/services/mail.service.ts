import { transport } from "../config/mailer";
import { IMailOoptions } from "../interfaces/email.interface";

class MailService {
    send(mail:IMailOoptions){
        return new Promise((resolve, reject) =>{
            transport.sendMail({
                from: `"Gamezonia Online Shop👻" <${process.env.USER_EMAIL}>`, // sender address
                to: mail.to, // list of receivers
                subject: mail.subject , // Subject line
                html: mail.html, // html body
              }, (error,_)=>{
                (error) ? reject({
                    status:false,
                    message: error
                }) : resolve({
                    status: true,
                    message: `Email correctamente enviado a ${mail.to}`,
                    mail
                })
            });
        })
    }
}

export default MailService