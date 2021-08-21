import { IResolvers } from '@graphql-tools/utils';
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
    Query:{
        async genres(_, variables, { db }){
            return await new GenreService(_,{pagination:variables},{db}).items()
        },
        async genre(_, {id}, { db }){
            return await new GenreService(_, {id}, {db}).details()
        }
    }
};

export default resolversGenreQuery