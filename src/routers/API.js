import express from 'express';
import productController from '../controllers/productController.js'
import cartController from '../controllers/cartController.js'
const routerAPI = express.Router();
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID);
routerAPI.post('/products',productController.controllerPostProduct);
routerAPI.put('/products/:id',productController.controllerPutProductByID);
routerAPI.delete('/products/:id', productController.controllerDeleteProductByID);
//shoppingCart
routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts);
routerAPI.post('/shoppingcart',cartController.controllerPostCart);
routerAPI.post('/shoppingcart/:id_cart/products',cartController.controllerPostProductToCart);
routerAPI.delete('/shoppingcart/:id_cart',cartController.controllerDeleteAllProductsFromCart);
routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod',cartController.controllerDeleteProductFromCartByID)
export default routerAPI;