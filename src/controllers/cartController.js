import cartContainer from '../models/cartContainer.js';
import productContainer from '../models/productContainer.js'
import Product from '../models/product.js';
import Cart from '../models/cart.js';
class cartControllerClass{
    #container
    constructor(){
        this.#container = cartContainer;
    }
    controllerGetCartProducts = (req, response) => {
        try{
            const cart = this.#container.getItemByID(req.params.id_cart);
                if(!cart){    
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
                }
                else{
                    response.status(200);
                    response.json(cart.products);
                }
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
            this.#container.save(newCart)
            response.status(200);
            response.json({mensaje: `el carrito ${newCart.getID()} fue agregado.`}) 
        }
        catch{
            response.status(500);
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerPostProductToCart = (req, response) => {
        try{
            if(req.params.id_cart){
                const cart = this.#container.getItemByID(req.params.id_cart);
                if(!cart){    
                    response.status(404);      
                    response.json({ mensaje: `no se encontró el producto con el id ${req.params.id}` });
                }
                else{
                    this.#container.addProductToCart(req.params.id_cart, productContainer.getItemByID(req.body.id_prod));
                    response.status(200);
                    response.json(this.#container.getItemByID(req.params.id_cart));
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
    controllerDeleteAllProductsFromCart = (req, response) => {
        try{
            if(this.#container.getItemByID(req.params.id_cart)){
                this.#container.deleteAllProductsInCart(req.params.id_cart);
                response.status(200);
                response.json({mensaje: `el carrito ${req.params.id_cart} fue vaciado.`}) 
            }
            else{
                response.status(404);      
                response.json({ mensaje: `no se encontró el carrito con el id ${req.params.id_cart}` });
            }
        }
        catch{
            response.status(500);
            response.json({ mensaje: `Hubo un problema interno del servidor, reintentar más tarde.` });
        }
    }
    controllerDeleteProductFromCartByID = (req, response) => {
        try{
            if(this.#container.getItemByID(req.params.id_cart)){
                //check if cart has product with matching id
                if(this.#container.getItemByID(req.params.id_cart).hasProduct(req.params.id_prod)){
                    this.#container.deleteProductInCart(req.params.id_cart, req.params.id_prod);
                    response.status(200);
                    response.json({mensaje: `el item ${req.params.id_prod} del carrito ${req.params.id_cart} fue eliminado.`}) 
                
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