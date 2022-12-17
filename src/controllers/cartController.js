import Product from '../models/classes/product.js';
import Cart from '../models/classes/cart.js';
import { PERSISTENCIA } from '../db/config/config.js';
import MemoryFSContainer from '../models/containers/MemoryFSContainer.js';
import FirestoreContainer from '../models/containers/firestoreContainer.js';
import MongoDBContainer from '../models/containers/mongoDBContainer.js';
import productController from './productController.js'
class cartControllerClass{
    #container
    constructor(){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.#container = new MongoDBContainer("carts")
                break
            case 'firestore':
                this.#container = new FirestoreContainer("carts")
                break
            default:
                this.#container = new MemoryFSContainer("carts")
        }
    }
    controllerGetCartProducts = (req, response) => {
        try{
            this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                if(!cart){    
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
                }
                else{
                    response.status(200);
                    response.json(cart.products);
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
    controllerPostCart = (req, response) => {
        try{
            let productListParsed = [];
            req.body.products.forEach(listedProduct => {
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                    product.setID(listedProduct.id);
                    productListParsed.push(product);
            });
            let newCart = new Cart(productListParsed);
            this.#container.save(newCart).then(()=>{
                response.status(200);
                response.json({mensaje: `el carrito ${newCart.getID()} fue agregado.`}) 
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
    controllerPostProductToCart = (req, response) => {
        try{
            if(req.params.id_cart){
                this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                    if(!cart){    
                        response.status(404);      
                        response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
                    }
                    else{
                        productController.getContainer().getItemByID(req.body.id_prod).then((product)=>{
                        if(product !== null){
                            this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                                cart.addProduct(product);
                                let cartProducts = cart.getProducts();
                                this.#container.modifyByID(req.params.id_cart, cartProducts).then(()=>{
                                    this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                                        response.status(200);
                                        response.json(cart);
                                    }).catch(()=>{
                                        response.status(500);      
                                        response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                                    });
                                }).catch(()=>{
                                    response.status(500);      
                                    response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                                });
                            }).catch(()=>{
                                response.status(500);      
                                response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                            });
                        }
                        else{    
                            response.status(404);      
                            response.json({ mensaje: `no se encontró el item con el id ${req.body.id_prod}` });
                        }
                    }).catch(()=>{
                        response.status(500);      
                        response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                    });
                    }
                }).catch(()=>{
                    response.status(500);      
                    response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                });
            }
            else{
                response.status(404);      
                response.json({ mensaje: `el id ${req.params.id_cart} es inválido` });
            }
        }
        catch{
            response.status(500);      
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerDeleteAllProductsFromCart = (req, response) => {
        try{
            this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                if(cart){
                    cart.addProduct([]);
                    this.#container.modifyByID(req.params.id_cart, []).then(()=>{
                        response.status(200);
                        response.json({mensaje: `el carrito ${req.params.id_cart} fue vaciado.`}) 
                    }).catch(()=>{
                        response.status(500);
                        response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                    });
                }
                else{
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
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
    controllerDeleteProductFromCartByID = (req, response) => {
        try{
            this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                if(cart){
                    //check if cart has product with matching id
                    if(cart.hasProduct(req.params.id_prod)){
                        cart.deleteProduct(req.params.id_prod);
                        this.#container.modifyByID(req.params.id_cart, cart.getProducts()).then(()=>{
                            response.status(200);
                            response.json({mensaje: `el item ${req.params.id_prod} del carrito ${req.params.id_cart} fue eliminado.`}) 
                        }).catch(()=>{
                            response.status(500);
                            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                        });
                    }
                    else{
                        response.status(404);      
                        response.json({ mensaje: `no se encontró el item ${req.params.id_prod} en el carrito ${req.params.id_cart}` });
                    }
                }
                else{
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
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
}
const cartController = new cartControllerClass
Object.freeze(cartController);
export default cartController;