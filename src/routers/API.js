import express from 'express';
import productController from '../controllers/productController.js'
const routerAPI = express.Router();
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID);
routerAPI.post('/products',productController.controllerPostProduct);
routerAPI.put('/products/:id',productController.controllerPutProductByID);
routerAPI.delete('/products/:id', productController.controllerDeleteProductByID);
//shoppingCart
export default routerAPI;