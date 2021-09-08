import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data";
import { ResolversOperationService } from "./resolvers-operations.service";

class PlatformService extends ResolversOperationService {
    collection = COLLECTIONS.PLATFORMS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    public async details(){
        const result = await this.get(this.collection)
        const {status, message, item: platform} = result
        return { status, message, platform }
    }
}

export default PlatformService