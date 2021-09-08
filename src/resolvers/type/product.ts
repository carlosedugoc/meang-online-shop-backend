import { IResolvers } from '@graphql-tools/utils';

const resolversProductType: IResolvers = {
    Product: {
        screenshot: (parent) => parent.shortScreenshots,
    }
};        

export default resolversProductType;
