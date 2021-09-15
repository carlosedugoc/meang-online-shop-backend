import { IResolvers } from '@graphql-tools/utils';
import PlatformService from '../../services/platform.service';
import ProductService from '../../services/product.service';
import { findElements } from '../../lib/db-operations';
import { COLLECTIONS } from '../../config/constants';

const resolversShopProductType: IResolvers = {
    ShopProduct: {
        productId: (parent) => parent.product_id,
        platformId: (parent) => parent.platform_id,
        product: async (parent, _, {db}) => {
            const result = await new ProductService({},{id:parent.product_id}, {db}).details();
            return result.product
        },
        platform: async (parent, _, {db}) => {
            const result = await new PlatformService({},{id:parent.platform_id}, {db}).details();
            return result.platform
        },
        relationalProducts: async (parent,_,{db}) => {
            return findElements(
                db,
                COLLECTIONS.SHOP_PRODUCT,
                {
                    $and: [
                        {product_id: parent.product_id},
                        {product_id: {$ne: parent.id}}
                    ]
                }
            )
        },
    }
};        

export default resolversShopProductType;

