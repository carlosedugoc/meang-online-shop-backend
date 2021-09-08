import resolversGenreQuery from './genre';
import resolversShopProductQuery from './shop-product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';
const GMR = require('@wiicamp/graphql-merge-resolvers')

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversGenreQuery,
    resolversTagQuery,
    resolversShopProductQuery
]);

export default queryResolvers