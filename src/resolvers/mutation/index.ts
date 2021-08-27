import resolversRegisterMutation from "./user";
import resolversGenreMutation from './genre';
import resolversTagMutation from './tag';

const GMR = require('@wiicamp/graphql-merge-resolvers')

const mutationResolvers = GMR.merge([
    resolversRegisterMutation,
    resolversGenreMutation,
    resolversTagMutation
]);

export default mutationResolvers

