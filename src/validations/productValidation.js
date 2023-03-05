import { Error } from "../error/error.js";

export default function productValidation(listedProduct, databaseProduct) {
    if(!databaseProduct){
        throw new Error(`No product was found with the ID ${listedProduct.id}`, 'BAD_REQUEST')
    }
    if(listedProduct.id !== databaseProduct.id || listedProduct.title !== databaseProduct.title || listedProduct.price !== databaseProduct.price || listedProduct.thumbnail !== databaseProduct.thumbnail){
        throw new Error('The information between product and database do not match', 'BAD_REQUEST')
    }
}