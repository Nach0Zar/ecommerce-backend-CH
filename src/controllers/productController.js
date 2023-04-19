import productService from '../services/productService.js';
import logger from '../utils/logger.js';

let instance = null;

class ProductController{
    controllerGetAllProducts = async (req, res, next) => {
        try{
            let items = await productService.getAllItems();
            logger.info(`GET REQUEST successful for all products`);
            res.status(200).json(items);
        }
        catch(error){
            next(error);
        }
    }
    controllerGetProductByID = async (req, res, next) => {
        try{
            let item = await productService.getProduct(req.params.id);
            logger.info(`GET REQUEST successful for product ${req.params.id}`);
            res.status(200).json(item)
        }
        catch(error){
            next(error);
        }
    }
    controllerPutProductByID = async (req, res, next) => {
        try{
            let item = await productService.modifyProductByID(req.params.id, req.body);
            logger.info(`PUT REQUEST successful for product ${req.params.id}`);
            res.status(200).json(item)
        }
        catch(error){
            next(error);
        }
    }
    controllerPostProduct = async (req, res, next) => {
        try{
            let productID = await productService.createProduct(req.body.title, req.body.price, req.body.thumbnail);
            logger.info(`POST REQUEST successful for product ${productID}`);
            res.status(200).json({message: `The item with ID ${productID} was added to the catalog.`})
        }
        catch(error){
            next(error);
        }
    }
    controllerDeleteProductByID = async (req, res, next) => {
        try{
            await productService.deleteProduct(req.params.id);
            logger.info(`DELETE REQUEST successful for product ${req.params.id}`);
            res.status(200).json({message: `The item with ID ${req.params.id} was deleted from the catalog.`})
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new ProductController();
        }
        return instance;
    }
}
export default ProductController.getInstance();