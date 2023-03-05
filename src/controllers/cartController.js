import cartService from '../services/cartService.js';

class CartControllerClass{
    controllerGetCartProducts = async (req, res, next) => {
        try{
            let products = await cartService.getCartProducts(req.params.id_cart);
            res.status(200).json(products);
        }
        catch(error){
            next(error);
        }
    }
    controllerPostCart = async (req, res, next) => {
        try{
            let newID = await cartService.createCart(req.body.products);
            res.status(201).json({id: newID});
        }
        catch(error){
            next(error);
        }
    }
    controllerPostProductToCart = async (req, res, next) => {
        try{
            let cartProducts = await cartService.addProductToCart(req.params.id_cart, req.body.id_prod);
            res.status(200).json(cartProducts);
        }
        catch(error){
            next(error);
        }
    }
    controllerDeleteAllProductsFromCart = async (req, res, next) => {
        try{
            await cartService.deleteAllProductsFromCart(req.params.id_cart);
            res.status(200).json({message: `el carrito ${req.params.id_cart} fue vaciado.`})
        }
        catch(error){
            next(error)
        }
    }
    controllerDeleteProductFromCartByID = async (req, res, next) => {
        try{
            await cartService.deleteProductFromCartByID(req.params.id_cart, req.params.id_prod);
            res.status(200).json({message: `el item ${req.params.id_prod} del carrito ${req.params.id_cart} fue eliminado.`}) 
        
        }
        catch(error){
            next(error)
        }
    }
}
const cartController = new CartControllerClass
Object.freeze(cartController);
export default cartController;