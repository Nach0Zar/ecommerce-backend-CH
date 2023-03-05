import productService from '../services/productService.js';

class ProductControllerClass{
    controllerGetAllProducts = async (req, res, next) => {
        try{
            let items = await productService.getAllItems();
            res.status(200).json(items);
        }
        catch(error){
            next(error);
        }
    }
    controllerGetProductByID = async (req, res, next) => {
        try{
            let item = await productService.getProduct(req.params.id);
            res.status(200).json(item)
        }
        catch(error){
            next(error);
        }
    }
    controllerPutProductByID = async (req, res, next) => {
        try{
            let item = await productService.modifyProductByID(req.params.id, req.body);
            res.status(200).json(item)
        }
        catch(error){
            next(error);
        }
    }
    controllerPostProduct = async (req, res, next) => {
        try{
            let productID = await productService.createProduct(req.body.title, req.body.price, req.body.thumbnail);
            res.status(200).json({message: `The item with ID ${productID} was added to the catalog.`})
        }
        catch(error){
            next(error);
        }
    }
    controllerDeleteProductByID = async (req, res, next) => {
        try{
            let productID = await productService.deleteProduct(req.params.id);
            res.status(200).json({message: `The item with ID ${productID} was deleted from the catalog.`})
        }
        catch(error){
            next(error);
        }
    }
}
const productController = new ProductControllerClass();
Object.freeze(productController);
export default productController;