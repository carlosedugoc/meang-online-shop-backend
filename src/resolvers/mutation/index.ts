import resolversRegisterMutation from "./user";

const GMR = require('@wiicamp/graphql-merge-resolvers')

const mutationResolvers = GMR.merge([
    resolversRegisterMutation
]);

export default mutationResolvers

