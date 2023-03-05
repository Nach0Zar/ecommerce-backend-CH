import { Error } from "../error/error.js";
import Service from "./service.js";
import productValidation from "../validations/productValidation.js";

class ProductService extends Service{
    constructor(){
        super("products")
    }
    getProduct = async (productID) => {
        //TODO: return PRODUCT object
    }
    checkExistingProduct = async (productID) => {
        let productFound = await this.container.getItemByID(productID);
        return (productFound !== null)
    }
    parseProducts = async (productList = []) => {
        let parsedProducts = [];
        for(const listedProduct in productList){
            let product = await productService.getProduct(listedProduct.id);
            productValidation(listedProduct, product);
            parsedProducts.push(product);
        }
        return parsedProducts;
    }
}
const productService = new ProductService();
Object.freeze(productService);
export default productService;