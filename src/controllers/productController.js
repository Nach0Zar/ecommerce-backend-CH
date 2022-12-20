import Product from '../models/classes/product.js';
import { PERSISTENCIA } from '../db/config/config.js';
import FirestoreContainer from '../models/containers/firestoreContainer.js';
import MongoDBContainer from '../models/containers/mongoDBContainer.js';
import MemoryFSContainer from '../models/containers/MemoryFSContainer.js';
class productControllerClass{
    #container
    constructor(){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.#container = new MongoDBContainer("products")
                break
            case 'firebase':
                this.#container = new FirestoreContainer("products")
                break
            default:
                this.#container = new MemoryFSContainer("products")
                break
        }
    }
    controllerGetAllProducts = (req, response) => {
        try{
            this.#container.getAllItems()
            .then((data)=>{
                if(!data){
                    response.status(404);      
                    response.json({ mensaje: `No se registran productos cargados.` });
                }
                else{
                    response.status(200);
                    response.json(data);
                }
            }).catch(()=>{
                response.status(500);      
                response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
            });
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerGetProductByID = (req, response) => {
        try{
            if(req.params.id){
                this.#container.getItemByID(req.params.id)
                .then((item)=>{
                    if(!item){    
                        response.status(404);      
                        response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                    }
                    else{
                        let product = new Product(item.title, item.price, item.thumbnail, item.id)
                        response.status(200);
                        response.json(product);
                    }
                }).catch(()=>{
                    response.status(404);      
                    response.json({ mensaje: `el id ${req.params.id} es inválido` });
                })
            }
            else{
                response.status(404);      
                response.json({ mensaje: `el id ${req.params.id} es inválido` });
            }
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerPutProductByID = (req, response) => {
        try{
            if(req.params.id){
                this.#container.getItemByID(req.params.id)
                .then((item)=>{
                    if(!item){    
                        response.status(404);      
                        response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                    }
                    else{
                        this.#container.modifyByID(req.params.id, req.body)
                        .then((changed)=>{
                            if(changed){
                                this.#container.getItemByID(req.params.id)
                                .then((item)=>{
                                    response.status(200);
                                    response.json(item);
                                }).catch(()=>{
                                    response.status(500);      
                                    response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                                });
                            }
                            else{
                                response.status(500);      
                                response.json({ mensaje: `Ningun elemento fue cambiado.` });
                            }
                        }).catch(()=>{
                            response.status(500);      
                            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                        });
                    }
                }).catch(()=>{
                    response.status(404);      
                    response.json({ mensaje: `el id ${req.params.id} es inválido` });
                })
            }
            else{
                response.status(404);      
                response.json({ mensaje: `el id ${req.params.id} es inválido` });
            }
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerPostProduct = (req, response) => {
        try{
            let newProduct = new Product(req.body.title, req.body.price, req.body.thumbnail);
            this.#container.save(newProduct).then(()=>{
                response.status(200);
                response.json({mensaje: `el item ${req.body.title} fue agregado.`}) 
            }).catch(()=>{
                response.status(500);
                response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
            })
        }
        catch{
            response.status(500);
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerDeleteProductByID = (req, response) => {
        try{
            if(req.params.id){
                this.#container.getItemByID(req.params.id).then((item)=>{
                    if(!item){
                        response.status(404);      
                        response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                    } 
                    else{   
                        this.#container.deleteByID(req.params.id).then((deleted)=>{
                            if(deleted){
                                response.status(200);    
                                response.json({mensaje: `el item con el id ${req.params.id} fue eliminado.`})
                            }
                            else{
                                response.status(500);    
                                response.json({mensaje: `el item con el id ${req.params.id} no fue eliminado.`})
                            }
                        }).catch(()=>{
                            response.status(500);      
                            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                        });
                    }
                }).catch(()=>{
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                });
            }
            else{
                response.status(404);      
                response.json({ mensaje: `el id ${req.params.id} es inválido.` });
            }
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    getContainer(){
        return this.#container;
    }
}
const productController = new productControllerClass();
Object.freeze(productController);
export default productController;