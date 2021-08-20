import { IResolvers } from '@graphql-tools/utils';
import GenreService from '../../services/genre.service';

const resolversGenreMutation: IResolvers = {
    Mutation: {
        async addGenre(_, variables, context){
            return await new GenreService(_, variables, context).insert()
        },
        async updateGenre(_, variables, context){
            return await new GenreService(_, variables, context).modify()
        },
        async deleteGenre(_, variables, context){
            return await new GenreService(_, variables, context).delete()
        }
    }
};

export default resolversGenreMutation
