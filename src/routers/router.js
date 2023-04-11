import express from 'express';
import productController from '../controllers/productController.js';
import userController from '../controllers/userController.js'
import passport from 'passport';
import checkUserLogged from '../middlewares/checkUserLogged.js';
import userIsAdmin from '../middlewares/userIsAdmin.js'

const routerAPI = express.Router();
//users
routerAPI.get('/users',checkUserLogged,userController.controllerGetUserInformation);
routerAPI.post('/users', userController.controllerPostRegisterUser);
routerAPI.post('/logout',checkUserLogged,userController.controllerPostLogOutUser);
//sessions
routerAPI.post('/sessions',passport.authenticate('local-login', { failWithError: false }),userController.controllerPostLogInUser);
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID);
routerAPI.post('/products', checkUserLogged, userIsAdmin, productController.controllerPostProduct);
routerAPI.put('/products/:id', checkUserLogged, userIsAdmin, productController.controllerPutProductByID);
routerAPI.delete('/products/:id', checkUserLogged, userIsAdmin, productController.controllerDeleteProductByID);
//shopping cart
// routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts);
// routerAPI.post('/shoppingcart', checkUserLogged, cartController.controllerPostCart);
// routerAPI.post('/shoppingcart/:id_cart/products', checkUserLogged, cartController.controllerPostProductToCart);
// routerAPI.delete('/shoppingcart/:id_cart', checkUserLogged, cartController.controllerDeleteAllProductsFromCart);
// routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod', checkUserLogged, cartController.controllerDeleteProductFromCartByID);
routerAPI.get('/shoppingcartproducts',checkUserLogged, userController.controllerGetUserCartInformation);
routerAPI.post('/shoppingcartproducts',checkUserLogged, userController.controllerPostProductToCart);
routerAPI.delete('/shoppingcartproducts/:id',checkUserLogged, userController.controllerDeleteProductFromCartByID);
//orders
routerAPI.get('/orders',checkUserLogged, userController.controllerGetUserOrders);
routerAPI.post('/orders',checkUserLogged, userController.controllerPostUserPurchaseCart);
export default routerAPI;