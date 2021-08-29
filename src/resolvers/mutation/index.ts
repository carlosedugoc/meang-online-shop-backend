import resolversRegisterMutation from "./user";
import resolversGenreMutation from './genre';
import resolversTagMutation from './tag';
import resolversMailMutation from "./email";

const GMR = require('@wiicamp/graphql-merge-resolvers')

const mutationResolvers = GMR.merge([
    resolversRegisterMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversMailMutation
]);

export default mutationResolvers

