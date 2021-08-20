import { findElements, findOneElement, insertOneElement, updateOneElement, deleteOneElement } from '../lib/db-operations';
import { IContextData } from '../interfaces/context-data';
import { IVariables } from '../interfaces/variables.interface';
import { Db } from 'mongodb';

export class ResolversOperationService {
    private root: object;
    private variables: IVariables;
    private context: IContextData;
    constructor(root:object, variables:IVariables, context:IContextData) {
        this.root = root;
        this.variables = variables
        this.context = context
    }

    protected getVariables(): IVariables {return this.variables}
    protected getContext(): IContextData {return this.context}
    protected getDb(): Db {return this.context.db!}

    protected async list(collection:string, listElement:string) {
        try {
            return {
                status:true,
                message: `Lista de ${listElement} cargada`,
                items: await findElements(this.getDb(), collection)
            }
        } catch (error) {
            return {
                status:false,
                message: `Lista de ${listElement} NO cargada ` + error,
                items: null
            }
        }
    }

    protected async get(collection:string) {
        try {
            return await findOneElement(this.getDb(), collection, {id: this.variables.id}).then(
                result=> {
                    if(result ) {
                        return {
                            status:true,
                            message: `${collection.toLowerCase()} ha sido cargada correctamente con sus detalles`,
                            item: result
                        }
                    }
                    return {
                        status:true,
                        message: `${collection.toLowerCase()} no ha obtenido detalles porque no existe`,
                        item: null
                    }
                }
            )
        } catch (error) {
            return {
                status:false,
                message: `Error inesperado al querer cargar los detalles de ${collection.toLowerCase()} - ${error} `,
                item: null
            }
        }
    }

    protected async add(collection:string, document: object, item:string) {
        try {
            return await insertOneElement(this.getDb(), collection, document).then(
               (result) =>{
                   if(result.insertedId){
                       return {
                           status:true,
                           message: `Añadido correctamente el ${item}`,
                           item: document
                       }
                   }
                   return {
                        status:false,
                        message: `No se ha logrado insertar ningun registro `,
                        item: null
                    }
               } 
            )
        } catch (err) {
            return {
                status:false,
                message: `Error inesperado al insertar el ${item} - ${err} `,
                item: null
            }
            
        }
    }

    protected async update(collection:string, filter: object, objectUpdate:object, item: string) {
        try {
            return await updateOneElement(this.getDb(), collection, filter, objectUpdate).then(
               (res) =>{
                   if (res.modifiedCount === 1) {
                       return {
                           status:true,
                           message: `El elemento del ${item} actualizado correctamente`,
                           item: Object.assign({}, filter, objectUpdate)
                       }
                   }
                   return {
                    status:false,
                    message: `No se ha logrado actualizar el ${item}`,
                    item: null
                }
               } 
            )
        } catch (err) {
            return {
                status:false,
                message: `Error inesperado al actualizar el ${item} - ${err} `,
                item: null
            }
            
        }
    }

    protected async del(collection:string, filter: object, item: string) {
        try {
            return await deleteOneElement(this.getDb(), collection, filter).then(
                result=> {
                    if(result.deletedCount === 1){
                        return {
                            status:true,
                            message: `El elemento del ${item} ha sido eliminado correctamente`,
                        }
                    }
                    return {
                        status:false,
                        message: `No se ha eliminado ningún ${item}`
                    }
                }
            )
        } catch (error) {
            return {
                status:false,
                message: `Error inesperado al eliminar el registro - ${error} `,
                item: null
            }
        }
    }

}