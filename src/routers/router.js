import express from 'express';
import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import userController from '../controllers/userController.js'
import passport from 'passport';
import checkUserLoggedValidation from '../validations/checkUserLoggedValidation.js';

const routerAPI = express.Router();
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID, );
routerAPI.post('/products', checkUserLoggedValidation, productController.controllerPostProduct);
routerAPI.put('/products/:id', checkUserLoggedValidation, productController.controllerPutProductByID);
routerAPI.delete('/products/:id', checkUserLoggedValidation, productController.controllerDeleteProductByID);
//shopping cart
routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts);
routerAPI.post('/shoppingcart', checkUserLoggedValidation, cartController.controllerPostCart);
routerAPI.post('/shoppingcart/:id_cart/products', checkUserLoggedValidation, cartController.controllerPostProductToCart);
routerAPI.delete('/shoppingcart/:id_cart', checkUserLoggedValidation, cartController.controllerDeleteAllProductsFromCart);
routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod', checkUserLoggedValidation, cartController.controllerDeleteProductFromCartByID)
//user
routerAPI.get('/user',checkUserLoggedValidation,userController.controllerGetUserInformation);
routerAPI.get('/user/shoppingcart',checkUserLoggedValidation,userController.controllerGetUserCartInformation);
routerAPI.post('/user/shoppingcart/purchase',checkUserLoggedValidation,userController.controllerPostUserPurchaseCart);
routerAPI.post('/login',passport.authenticate('local-login', { failWithError: false }),userController.controllerPostLogInUser);
routerAPI.post('/register', userController.controllerPostRegisterUser);
routerAPI.post('/logout',checkUserLoggedValidation,userController.controllerPostLogOutUser);
export default routerAPI;