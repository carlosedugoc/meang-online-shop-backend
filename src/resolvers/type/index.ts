import resolversPlatformType from "./platform";
import resolversProductType from "./product";
import resolversShopProductType from "./shop-product";

const GMR = require('@wiicamp/graphql-merge-resolvers')

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType
]);

export default typeResolvers
