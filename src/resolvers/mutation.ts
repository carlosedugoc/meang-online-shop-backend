import bcrypt from 'bcrypt'
import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS } from '../config/constants';

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      //COMPROBAR QUE EL USUARIO NO EXISTE
      const userCheck = await db.collection(COLLECTIONS.USERS).findOne({email:user.email})
      console.log(userCheck)
      if (userCheck) return {
        status: false,
        message: `El Email ${user.email} ya existe`,
        user: null,
      };
      //COMPROBAR EL ULTIMO USUARIO REGISTRADO PARA ASIGNAR ID
      const lastUser = await db.collection(COLLECTIONS.USERS).find().limit(1).sort({ registerDate: -1 }).toArray();
      if (lastUser.length === 0) user.id = 1;
      else user.id = lastUser[0].id + 1;
      // ASIGNAR FECHA EN FORMATO ISO
      user.registerDate = new Date().toISOString();
      //ENCRIPTAR PASSWORD
      user.password = bcrypt.hashSync(user.password, 10);
      // GUARDAR DOCUMENTO EN LA COLECCIÓN
      return await db
        .collection(COLLECTIONS.USERS)
        .insertOne(user)
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

export default resolversMutation;
