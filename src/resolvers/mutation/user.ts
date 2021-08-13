import bcrypt from 'bcrypt'
import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS } from '../../config/constants';
import { asignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';

const resolversRegisterMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      //COMPROBAR QUE EL USUARIO NO EXISTE
      const userCheck = await findOneElement(db, COLLECTIONS.USERS, {email:user.email})
      if (userCheck) return {
        status: false,
        message: `El Email ${user.email} ya existe`,
        user: null,
      };
      //COMPROBAR EL ULTIMO USUARIO REGISTRADO PARA ASIGNAR ID
      user.id = await asignDocumentId(db, COLLECTIONS.USERS, {registerDate: -1})
      // ASIGNAR FECHA EN FORMATO ISO
      user.registerDate = new Date().toISOString();
      //ENCRIPTAR PASSWORD
      user.password = bcrypt.hashSync(user.password, 10);
      // GUARDAR DOCUMENTO EN LA COLECCIÓN
      return await insertOneElement(db, COLLECTIONS.USERS, user)
        .then(async () => {
          return {
            status: true,
            message: `Usuario creado satisfactoriamente`,
            user
          };
        })
        .catch((err: Error) => {
          return {
            status: true,
            message: `Ha ocurrido el siguiente error al tratar de crear el usuario: ${err}`,
            user: null
          };
        });
    },
  },
};

export default resolversRegisterMutation;
