import { Db, Sort } from "mongodb";
import { IPaginationOptions } from '../interfaces/pagination-options';

/**
 * 
 * @param database Base de datos con la que estamos trabajando
 * @param collection Colección en la que vamos a buscar el ultimo elemento
 * @param sort Objeto para organizar la busqueda
 */
export const asignDocumentId = async(
    database: Db,
    collection: string,
    sort: Sort = { registerDate: -1}) =>{

    const lastElement = await database.collection(collection).find().limit(1).sort(sort).toArray();

    if (lastElement.length === 0) return '1';
    return String(+lastElement[0].id + 1);
}

export const findOneElement = async (
    database: Db,
    collection: string,
    filter: object
) => {
    return await database.collection(collection).findOne(filter)
}

export const findElements = async (
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions
) => {
    if(paginationOptions.total === -1) return await database.collection(collection).find(filter).toArray()
    return await database.collection(collection).find(filter).limit(paginationOptions.itemsPage).skip(paginationOptions.skip).toArray()
}

export const insertOneElement = async (
    database: Db,
    collection: string,
    document: object
) => {
    return await database.collection(collection).insertOne(document)
}

export const insertManyElement = async (
    database: Db,
    collection: string,
    documents: Array<object>
) => {
    return await database.collection(collection).insertMany(documents)
}

export const updateOneElement = async (
    database: Db,
    collection: string,
    filter: object = {},
    updateObject: object
) => {
    return await database.collection(collection).updateOne(filter, {$set: updateObject});
}

export const deleteOneElement = async (
    database: Db,
    collection: string,
    filter: object
) => {
    return await database.collection(collection).deleteOne(filter)
}

export const countElements = async(database:Db, collection: string, filter: object = {})=>{
    return await database.collection(collection).countDocuments(filter)
}


