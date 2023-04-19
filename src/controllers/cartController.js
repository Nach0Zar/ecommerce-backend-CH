import cartService from '../services/cartService.js';
import logger from '../utils/logger.js';

let instance = null;

class CartControllerClass{
    controllerGetCartProducts = async (req, res, next) => {
        try{
            let cartInformation = await cartService.getCartProducts(req.cookies.email);
            logger.info(`GET REQUEST successful for cart information from user ${req.cookies.email}`);
            res.status(200).json(cartInformation) 
        }
        catch(error){
            next(error)
        }
    }
    controllerPostProductToCart = async (req, res, next) => {
        try{
            let cartProducts = await cartService.addProductToCart(req.cookies.email, req.body.productId);
            logger.info(`POST REQUEST successful for product ${req.body.productId} in cart from user${req.cookies.email}`);
            res.status(200).json(cartProducts);
        }
        catch(error){
            next(error);
        }
    }
    controllerDeleteProductFromCart = async (req, res, next) => {
        try{
            await cartService.deleteProductFromCart(req.cookies.email, req.params.id_prod);
            logger.info(`DELETE REQUEST successful for product ${req.params.id_prod} in cart ID ${req.params.id_cart}`);
            res.status(200).json({message: `el item ${req.params.id_prod} del carrito del user ${req.cookies.email} fue eliminado.`}) 
        }
        catch(error){
            next(error)
        }
    }
    static getInstance(){
        if(!instance){
            instance = new ProductService();
        }
        return instance;
    }
}
export default CartControllerClass.getInstance();