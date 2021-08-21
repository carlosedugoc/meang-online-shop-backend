import { ResolversOperationService } from "./resolvers-operations.service";
import { IContextData } from '../interfaces/context-data';
import { COLLECTIONS } from '../config/constants';
import { findOneElement, asignDocumentId } from '../lib/db-operations';
import slugify from "slugify";

class GenreService extends ResolversOperationService {
    private collection: string = COLLECTIONS.GENRES
    constructor(root:object, variables:object, context:IContextData) {
        super(root, variables, context)
    }

    public async items(){
        const page = this.getVariables().pagination?.page
        const itemsPage = this.getVariables().pagination?.itemsPage
        const result = await this.list(this.collection, 'Generos', page, itemsPage)
        const {status, message, items: genres, info} = result
        return { info, status, message, genres }
    }

    public async details(){
        const result = await this.get(this.collection)
        const {status, message, item: genre} = result
        return { status, message, genre }
    }

    public async insert(){
        const newGenre = this.getVariables().genre
        if(!this.checkData(newGenre || '')){
            return {
                status: false,
                message: 'El género no se ha especificado correctamente',
                genre: null
            }
        }
        if (await this.checkInDatabase(newGenre || '')){
            return {
                status: false,
                message: 'El género existe en la base de datos',
                genre: null
            }
        }
        const genreObject = {
            id: await asignDocumentId(this.getDb(), this.collection, {id: -1}),
            name: newGenre,
            slug: slugify(newGenre || '', {lower: true} )
        }
        const result = await this.add(this.collection, genreObject, 'genero')
        const {status, message, item: genre} = result
        return { status, message, genre }
    }

    public async modify(){
        const id = this.getVariables().id
        const genreToModify = this.getVariables().genre
        if(!this.checkData(String(id) || '')){
            return {
                status: false,
                message: 'El ID del género no se ha especificado correctamente',
                genre: null
            }
        }
        const genreObject = {
            name: genreToModify,
            slug: slugify(genreToModify || '', {lower: true} )
        }
        const result = await this.update(this.collection,{id},genreObject,'género')
        const {status, message, item: genre} = result
        return { status, message, genre }
    }

    public async delete(){
        const id = this.getVariables().id
        if(!this.checkData(String(id) || '')){
            return {
                status: false,
                message: 'El ID del género no se ha especificado correctamente',
                genre: null
            }
        }
        const result = await this.del(this.collection, {id}, 'genero' )
        const {status, message} = result
        return { status, message }
    }

    private checkData(value: string) {
        return (!value) ? false : true
    }

    private async checkInDatabase(value: string) {
        return await findOneElement(this.getDb(), this.collection, {name: value})
    }

}

export default GenreService