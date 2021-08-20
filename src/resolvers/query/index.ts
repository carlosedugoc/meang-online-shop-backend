import resolversGenreQuery from './genre';
import resolversProductQuery from './product';
import resolversUserQuery from './user';
const GMR = require('@wiicamp/graphql-merge-resolvers')

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversProductQuery,
    resolversGenreQuery
]);

export default queryResolvers