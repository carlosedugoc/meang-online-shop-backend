import { IResolvers } from '@graphql-tools/utils';
import UserService from '../../services/user.service';

const resolversRegisterMutation: IResolvers = {
  Mutation: {
    async register(_, variables, { db }) {
      return await new UserService(_,variables,{db}).register()
    },
    async updateUser(_, {user}, context) {
      return await new UserService(_,{user},context).modify()
    },
    async deleteUser(_, {id}, context) {
      return await new UserService(_,{id},context).delete()
    },
    async blockUser(_, {id, unblock, admin}, context){
      return await new UserService(_, {id}, context).unblock(unblock, admin)
  }
  },
};

export default resolversRegisterMutation;
