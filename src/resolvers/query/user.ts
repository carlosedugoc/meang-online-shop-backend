import { IResolvers } from '@graphql-tools/utils';
import UserService from '../../services/user.service';

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
      return await new UserService(_,__,context).items();
    },

    async login(_, {email, password}, context){
      return await new UserService(_, { user: { email, password}}, context).login();
    },

    async me(_, __, { token }){
      return await new UserService(_, __, {token}).auth();
    }

    
  },
};

export default resolversUserQuery;