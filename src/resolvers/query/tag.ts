import { IResolvers } from '@graphql-tools/utils';
import TagsService from '../../services/tag.service';

const resolversTagQuery: IResolvers = {
    Query: {
        async tags(_, {page, itemsPage, active}, { db }) {
            return new TagsService(_, {
                pagination: {page, itemsPage}
            }, { db }).items(active);
        },
        async tag(_, { id }, { db }) {
            return new TagsService(_, { id }, { db }).details();
        }
    }
};

export default resolversTagQuery;