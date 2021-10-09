import resolversStripeCustomerQuery from './customer';
import resolversStripeCardQuery from './card';
import resolversStripeChargeQuery from './charge';

const GMR = require('@wiicamp/graphql-merge-resolvers')

const queryStripeResolvers = GMR.merge([
    resolversStripeCustomerQuery,
    resolversStripeCardQuery,
    resolversStripeChargeQuery
]);
export default queryStripeResolvers;