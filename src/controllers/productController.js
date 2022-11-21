import * as url from 'url';
import Container from '../models/container.js';
import Product from '../models/product.js';
class productControllerClass{
    #container
    constructor(){
        let filepath = url.fileURLToPath(new URL('.', import.meta.url))+"../products.txt";
        this.#container = new Container(filepath);
    }
    controllerGetAllProducts (req, response){
        try{
            response.status(200);
            response.json(this.#container.getAllItems());
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerGetProductByID(req, response){
        try{
            if(+req.params.id){
                const buscado = this.#container.getItemByID(+req.params.id);
                if(!buscado){    
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                }
                else{
                    response.status(200);
                    response.json(buscado);
                }
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
    controllerPutProductByID(req, response){
        try{
            if(+req.params.id){
                const buscado = this.#container.getById(+req.params.id);
                if(!buscado){    
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                }
                else{
                    this.#container.modifyProductById(+req.params.id, req.body)
                    response.status(200);
                    response.json(req.body);
                }
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
    controllerGetAmmountOfProducts(req, response){
        try{
            //response.sendStatus(200) just sends status code
            response.status(200);    
            response.send(this.#container.getLength().toString());
        }
        catch{
            response.status(500); //just sends status code
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerGetRandomProduct(req, response){
        try{
            //response.sendStatus(200) just sends status code
            response.status(200);    
            response.json(this.#container.getRandomProduct());
        }
        catch{
            response.status(500); //just sends status code
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerPostProduct(req, response){
        try{
            this.#container.save(req.body)
            //response.sendStatus(200) just sends status code
            response.status(200);
            response.json({mensaje: `el item ${req.body.title} fue agregado.`}) 
        }
        catch{
            response.status(500); //just sends status code
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerDeleteProductByID(req, response){
        try{
            if(+req.params.id){
                if(!this.#container.getById(+req.params.id)){
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                } 
                else{   
                    this.#container.deleteById(req.params.id);
                    response.status(200);    
                    response.json({mensaje: `el item con el id ${req.params.id} fue eliminado.`}) 
                }
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
}
const productController = new productControllerClass
Object.freeze(productController);
export default productController;