import { Error } from "../error/error.js";
import Service from "./service.js";

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
}
const productService = new ProductService();
Object.freeze(productService);
export default productService;