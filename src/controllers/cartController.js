import Product from '../models/product.js';
import Cart from '../models/cart.js';
import { PERSISTENCIA } from '../db/config/config.js';
import MemoryFSContainer from '../containers/MemoryFSContainer.js';
import FirestoreContainer from '../containers/firestoreContainer.js';
import MongoDBContainer from '../containers/mongoDBContainer.js';
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
            this.createCart(req.body.products).then((newID)=>{
                response.status(200);
                response.json({id: newID}) 
            }).catch(()=>{
                response.status(500);
                response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.`, id: -1 });
            });
        }
        catch{
            response.status(500);
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.`, id: -1  });
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
                                    let parsedProducts = []
                                    cart.products.forEach((listedProduct)=>{
                                        parsedProducts.push(new Product( listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id))
                                    })
                                    let cartItem = new Cart(parsedProducts, req.params.id_cart);
                                    cartItem.addProduct(productCreated);
                                    this.#container.modifyByID(req.params.id_cart, cartItem.toDTO()).then(()=>{
                                        this.#container.getItemByID(req.params.id_cart).then((cartUpdated)=>{
                                            response.status(200);
                                            response.json(cartUpdated.products);
                                        }).catch(()=>{
                                            response.status(500);      
                                            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
                                        });
                                    }).catch(()=>{
                                        response.status(501);      
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
                    let parsedProducts = []
                    cartFound.products.forEach((listedProduct)=>{
                        parsedProducts.push(new Product( listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id))
                    })
                    let cart = new Cart(parsedProducts, req.params.id_cart);
                    if(cart.hasProduct(req.params.id_prod)){
                        cart.deleteProduct(req.params.id_prod);
                        this.#container.modifyByID(req.params.id_cart, cart.toDTO()).then(()=>{
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
    createCart = (items) => { 
        let productListParsed = [];
        let products = items ?? [];// if we want to create an empty cart or if products are loaded first
        products.forEach(listedProduct => {
                let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id);
                productListParsed.push(product);
        });
        let newCart = new Cart(productListParsed);
        return this.#container.save(newCart)
    }
}
const cartController = new cartControllerClass
Object.freeze(cartController);
export default cartController;