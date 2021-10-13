import { IResolvers } from '@graphql-tools/utils';
import { withFilter } from 'graphql-subscriptions';
import { SUBSCRIPTIONS_EVENT } from '../../config/constants';
import { pubsub } from '../../server';

const resolversShopProductSubscription: IResolvers = {
    Subscription: {
        updateStockProduct: {
            subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT])
        },
        selectProductStockUpdate: {
            subscribe: withFilter(() => pubsub.asyncIterator([SUBSCRIPTIONS_EVENT.UPDATE_STOCK_PRODUCT]), (payload, variables, context) => {
                console.log(payload, variables);
                return +payload.selectProductStockUpdate.id === +variables.id;
            }),
        }
    }
};

export default resolversShopProductSubscription;
