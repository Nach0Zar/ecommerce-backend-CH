import { Error } from "../error/error.js";
import cartService from "../services/cartService.js";
import productService from "../services/productService.js";

export default async function productAndCartIDsValidation(cartID, productID) {
    if(!cartID){
        throw new Error(`Cart ID ${cartID} is invalid`, 'BAD_REQUEST');
    }
    if(!(await cartService.checkExistingCart(cartID))){
        throw new Error(`No cart was found with the ID ${cartID}`, 'NOT_FOUND');
    }
    if(!productID){
        throw new Error(`Product ID ${productID} is invalid`, 'BAD_REQUEST');
    }
    if(!(await productService.checkExistingProduct(productID))){
        throw new Error(`No product was found with the ID ${productID}`, 'NOT_FOUND');
    }
}