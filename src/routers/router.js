import express from 'express';
import passport from 'passport';
import productController from '../controllers/productController.js';
import userController from '../controllers/userController.js'
import cartController from '../controllers/cartController.js';
import orderController from '../controllers/orderController.js';
import imageController from '../controllers/imageController.js';
import checkUserLogged from '../middlewares/checkUserLogged.js';
import userIsAdmin from '../middlewares/userIsAdmin.js'
import { postImage } from '../middlewares/imageHandler.js';

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
routerAPI.get('/shoppingcartproducts',checkUserLogged, cartController.controllerGetCartProducts);
routerAPI.post('/shoppingcartproducts',checkUserLogged, cartController.controllerPostProductToCart);
routerAPI.delete('/shoppingcartproducts/:id_prod',checkUserLogged, cartController.controllerDeleteProductFromCart);
//orders
routerAPI.get('/orders',checkUserLogged, orderController.controllerGetOrders);
routerAPI.post('/orders',checkUserLogged, orderController.controllerPostPurchaseCart);
//images
routerAPI.post('/images', postImage('file'), imageController.controllerPostImage);
export default routerAPI;