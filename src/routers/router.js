import express from 'express';
import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import userController from '../controllers/userController.js';
import passport from 'passport';
const routerAPI = express.Router();
//check user loggedIn
function checkUserLoggedStatus(req, res, next) {
    if (req.cookies.email) {
        next();
    } else {
        res.status(403);
        res.json({ error : -1, mensaje: "usuario no autorizado"})
    }
}
//Check for errors
function checkErrors(req, res, error){
    switch (error.type){
        case 'NOT_FOUND':{
            res.status(404);
            break;
        }
        case 'CONFLICT':{
            res.status(409);
            break;
        }
        case 'FORBIDDEN':{
            res.status(403);
            break;
        }
        default: {
            res.status(500)
        }
    }
    res.json({message: error.message})
}
//products
routerAPI.get('/products',productController.controllerGetAllProducts, checkErrors);
routerAPI.get('/products/:id',productController.controllerGetProductByID, checkErrors);
routerAPI.post('/products', checkUserLoggedStatus, productController.controllerPostProduct, checkErrors);
routerAPI.put('/products/:id', checkUserLoggedStatus, productController.controllerPutProductByID, checkErrors);
routerAPI.delete('/products/:id', checkUserLoggedStatus, productController.controllerDeleteProductByID, checkErrors);
//shopping cart
routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts, checkErrors);
routerAPI.post('/shoppingcart', checkUserLoggedStatus, cartController.controllerPostCart, checkErrors);
routerAPI.post('/shoppingcart/:id_cart/products', checkUserLoggedStatus, cartController.controllerPostProductToCart, checkErrors);
routerAPI.delete('/shoppingcart/:id_cart', checkUserLoggedStatus, cartController.controllerDeleteAllProductsFromCart, checkErrors);
routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod', checkUserLoggedStatus, cartController.controllerDeleteProductFromCartByID, checkErrors)
//user
routerAPI.get('/user',checkUserLoggedStatus,userController.controllerGetUserInformation, checkErrors);
routerAPI.get('/user/shoppingcart',checkUserLoggedStatus,userController.controllerGetUserCartInformation, checkErrors);
routerAPI.post('/login',passport.authenticate('local-login', { failWithError: false }),userController.loginUser, checkErrors);
routerAPI.post('/register',userController.registerUser, checkErrors);
routerAPI.post('/logout',checkUserLoggedStatus,userController.logoutUser, checkErrors);
export default routerAPI;