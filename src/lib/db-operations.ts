import { Db, Sort } from "mongodb";

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

    if (lastElement.length === 0) return 1;
    return lastElement[0].id + 1;
     
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
    filter: object = {}
) => {
    return await database.collection(collection).find(filter).toArray();
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


