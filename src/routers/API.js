import express from 'express';
import productController from '../controllers/productController.js'
import cartController from '../controllers/cartController.js'
const routerAPI = express.Router();
let userIsAdmin = false;
//admin Status
function checkAdminStatus(req, res, next) {
    if (userIsAdmin) {
        next();
    } else {
        res.status(403);
        res.json({ error : -1, descripcion: "usuario no autorizado"})
    }
}
routerAPI.post('/login', (req, res) => {
    userIsAdmin = true
    res.sendStatus(200)
})
routerAPI.post('/logout', (req, res) => {
    userIsAdmin = false
    res.sendStatus(200)
})
//products
routerAPI.get('/products',productController.controllerGetAllProducts);
routerAPI.get('/products/:id',productController.controllerGetProductByID);
routerAPI.post('/products', checkAdminStatus, productController.controllerPostProduct);
routerAPI.put('/products/:id', checkAdminStatus, productController.controllerPutProductByID);
routerAPI.delete('/products/:id', checkAdminStatus, productController.controllerDeleteProductByID);
//shoppingCart
routerAPI.get('/shoppingcart/:id_cart/products',cartController.controllerGetCartProducts);
routerAPI.post('/shoppingcart', checkAdminStatus, cartController.controllerPostCart);
routerAPI.post('/shoppingcart/:id_cart/products', checkAdminStatus, cartController.controllerPostProductToCart);
routerAPI.delete('/shoppingcart/:id_cart', checkAdminStatus, cartController.controllerDeleteAllProductsFromCart);
routerAPI.delete('/shoppingcart/:id_cart/products/:id_prod', checkAdminStatus, cartController.controllerDeleteProductFromCartByID)
export default routerAPI;