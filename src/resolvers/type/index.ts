import resolversShopProductType from './shop-product';
import resolversPlatformType from './platform';
import resolversProductType from './product';
import typeStripeResolvers from './stripe';

const GMR = require('@wiicamp/graphql-merge-resolvers')

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType,
    // Stripe 
    typeStripeResolvers
]);
export default typeResolvers;