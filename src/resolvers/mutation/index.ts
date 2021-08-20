import resolversRegisterMutation from "./user";
import resolversGenreMutation from './genre';

const GMR = require('@wiicamp/graphql-merge-resolvers')

const mutationResolvers = GMR.merge([
    resolversRegisterMutation,
    resolversGenreMutation
]);

export default mutationResolvers

