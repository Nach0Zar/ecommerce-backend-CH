import { Error } from "../error/error.js";
import userService from "../services/userService.js";
import productService from "../services/productService.js";

export default async function productAndEmailsValidation(email, productID) {
    if(!email){
        throw new Error(`Email ${email} is invalid`, 'BAD_REQUEST');
    }
    if(!(await userService.checkExistingUser(email))){
        throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
    }
    if(!productID){
        throw new Error(`Product ID ${productID} is invalid`, 'BAD_REQUEST');
    }
    if(!(await productService.checkExistingProduct(productID))){
        throw new Error(`No product was found with the ID ${productID}`, 'NOT_FOUND');
    }
}