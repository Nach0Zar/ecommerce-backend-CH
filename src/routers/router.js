import express from 'express';
import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import userController from '../controllers/userController.js';
import passport from 'passport';
const routerAPI = express.Router();
//users
function checkUserLoggedStatus(req, res, next) {
    if (req.cookies.email) {
        next();
    } else {
        res.status(403);
        res.json({ error : -1, mensaje: "usuario no autorizado"})
    }
}
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID);
routerAPI.post('/products', checkUserLoggedStatus, productController.controllerPostProduct);
routerAPI.put('/products/:id', checkUserLoggedStatus, productController.controllerPutProductByID);
routerAPI.delete('/products/:id', checkUserLoggedStatus, productController.controllerDeleteProductByID);
//shopping cart
routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts);
routerAPI.post('/shoppingcart', checkUserLoggedStatus, cartController.controllerPostCart);
routerAPI.post('/shoppingcart/:id_cart/products', checkUserLoggedStatus, cartController.controllerPostProductToCart);
routerAPI.delete('/shoppingcart/:id_cart', checkUserLoggedStatus, cartController.controllerDeleteAllProductsFromCart);
routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod', checkUserLoggedStatus, cartController.controllerDeleteProductFromCartByID)
//user
routerAPI.get('/user',checkUserLoggedStatus,userController.controllerGetUserInformation);
routerAPI.get('/user/shoppingcart',checkUserLoggedStatus,userController.controllerGetUserCartInformation);
routerAPI.post('/login',passport.authenticate('local-login', { failWithError: false }),userController.loginUser);
routerAPI.post('/register',userController.registerUser);
routerAPI.post('/logout',checkUserLoggedStatus,userController.logOutUser);
export default routerAPI;