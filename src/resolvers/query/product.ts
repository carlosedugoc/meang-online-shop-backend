import { IResolvers } from '@graphql-tools/utils';

const resolversProductQuery: IResolvers = {
  Query: {
    products(){
     return true
    }
  },
};

export default resolversProductQuery;