import { COLLECTIONS, ACTIVE_VALUES_FILTER } from '../config/constants';
import { IContextData } from "../interfaces/context-data";
import { ResolversOperationService } from "./resolvers-operations.service";
import { randomItems } from '../lib/db-operations';

class ShopProductService extends ResolversOperationService {
    collection = COLLECTIONS.SHOP_PRODUCT;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    public async items(
        active: string = ACTIVE_VALUES_FILTER.ACTIVE, 
        platform: Array<string> = ['-1'], 
        random: boolean =false,
        otherFilters: object = {}){
        const page = this.getVariables().pagination?.page
        const itemsPage = this.getVariables().pagination?.itemsPage
        let filter: object = {active: {$ne:false}}
        if (active ===  ACTIVE_VALUES_FILTER.ALL) filter = {}
        if (active ===  ACTIVE_VALUES_FILTER.INACTIVE) filter = {active: false}
        if (platform[0] !== '-1') filter = {...filter, ...{platform_id: { $in: platform}}}
        if (otherFilters !== {} && otherFilters !== undefined) filter = {...filter, ...otherFilters}
        if(!random){
            const result = await this.list(this.collection, 'Productos de la tienda', page, itemsPage, filter)
            const {status, message, items: shopProducts, info} = result
            return { info, status, message, shopProducts }
        }
        const result: Array<object> = await randomItems(this.getDb(),this.collection, filter, itemsPage)
        if(result.length === 0 || result.length !== itemsPage ){
            return { 
                info: {page:1, pages:1, itemsPage, total:0}, 
                status: false, 
                message: "Información no encontrada",
                shopProducts: []
            }
        }
        return { 
            info: {page:1, pages:1, itemsPage, total:itemsPage}, 
            status: true, 
            message: "Información cargada correctamente",
            shopProducts: result
        }
    }

    public async details() {
        const result = await this.get(this.collection)
        const {status, message, item: shopProduct} = result
        return { status, message, shopProduct }
    }

}

export default ShopProductService;