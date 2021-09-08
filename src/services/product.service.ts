import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data";
import { ResolversOperationService } from "./resolvers-operations.service";

class ProductService extends ResolversOperationService {
    collection = COLLECTIONS.PRODUCTS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    public async details(){
        const result = await this.get(this.collection)
        const {status, message, item: product} = result
        return { status, message, product }
    }
}

export default ProductService