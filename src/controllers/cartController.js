import Product from '../models/classes/product.js';
import Cart from '../models/classes/cart.js';
import { PERSISTENCIA } from '../db/config/config.js';
import MemoryFSContainer from '../models/containers/MemoryFSContainer.js';
import FirestoreContainer from '../models/containers/firestoreContainer.js';
import MongoDBContainer from '../models/containers/mongoDBContainer.js';
import productController from './productController.js';
class cartControllerClass{
    #container
    constructor(){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.#container = new MongoDBContainer("carts")
                break
            case 'firebase':
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
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id);
                    productListParsed.push(product);
            });
            let newCart = new Cart(productListParsed);
            this.#container.save(newCart).then((newID)=>{
                response.status(200);
                response.json({mensaje: `el carrito ${newID} fue agregado.`}) 
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
                        productController.getContainer().getItemByID(req.body.id_prod)
                        .then((product)=>{
                            if(product !== null){
                                let productCreated = new Product( product.title, product.price, product.thumbnail, req.body.id_prod)
                                this.#container.getItemByID(req.params.id_cart).then((cart)=>{
                                    let cartItem = new Cart(cart.products, req.params.id_cart);
                                    cartItem.addProduct(product);
                                    this.#container.modifyByID(req.params.id_cart, cartItem).then(()=>{
                                        this.#container.getItemByID(req.params.id_cart).then((cartUpdated)=>{
                                            response.status(200);
                                            response.json(cartUpdated.products);
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
                            response.status(404);      
                            response.json({ mensaje: `no se encontró el item con el id ${req.body.id_prod}` });
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
                    this.#container.modifyByID(req.params.id_cart, {products: []}).then(()=>{
                        response.status(200);
                        response.json({mensaje: `el carrito ${req.params.id_cart} fue vaciado.`}) 
                    }).catch(()=>{
                        response.status(502);
                        response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                    });
                }
                else{
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
                }
            }).catch(()=>{
                response.status(404);      
                response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
            });
        }
        catch{
            response.status(500);
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerDeleteProductFromCartByID = (req, response) => {
        try{
            this.#container.getItemByID(req.params.id_cart).then((cartFound)=>{
                if(cartFound){
                    //check if cart has product with matching id
                    let cart = new Cart(cartFound.products, req.params.id_cart);
                    if(cart.hasProduct(req.params.id_prod)){
                        cart.deleteProduct(req.params.id_prod);
                        this.#container.modifyByID(req.params.id_cart, { products: cart.getProducts()}).then(()=>{
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