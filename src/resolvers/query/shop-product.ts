import { IResolvers } from '@graphql-tools/utils';
import ShopProductService from '../../services/shop-product.service';

const resolversShopProductQuery: IResolvers = {
  Query: {
    shopProducts(_, {page, itemsPage, active}, context) {
      return new ShopProductService(_,{
        pagination: {page, itemsPage}
      }, context).items(active)
    },
    shopProductsPlatform(_, {page, itemsPage, active, platform, random}, context) {
      return new ShopProductService(_,{
        pagination: {page, itemsPage}
      }, context).items(active, platform, random)
    },
    shopProductsOffersLast(_, {page, itemsPage, active, random, lastUnits, topPrice}, context) {
      let otherFilters = {}
      if(lastUnits > 0 && topPrice > 10) {
        otherFilters = {
          $and: [
            {price: {$lte: topPrice}},
            {stock: {$lte: lastUnits}}
          ]
        }
      } else if(lastUnits >= 0 && topPrice > 10) {
        otherFilters = {price: {$lte: topPrice}}
      } else if(lastUnits > 0 && topPrice <= 10) {
        otherFilters = {stock: {$lte: lastUnits}}
      }

      return new ShopProductService(_,{
        pagination: {page, itemsPage}
      }, context).items(active, '', random, otherFilters)

    }
  },
};

export default resolversShopProductQuery;