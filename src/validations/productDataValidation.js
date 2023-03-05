import { Error } from "../error/error.js";

export default function productDataValidation(title, price, thumbnail) {
    if(isEmpty(title)){
        throw new Error(`The product title can not be empty.`, 'BAD_REQUEST')
    }
    if(isEmpty(price)){
        throw new Error(`The product price can not be empty.`, 'BAD_REQUEST')
    }
    if(isEmpty(thumbnail)){
        throw new Error(`The product thumbnail can not be empty.`, 'BAD_REQUEST')
    }
    if(!isNaN(price)){
        throw new Error(`The product price must be a number.`, 'BAD_REQUEST')
    }
    if(+price < 0){
        throw new Error(`The product price can not be negative.`, 'BAD_REQUEST')
    }
    if(+price === 0){
        throw new Error(`The product price can not be zero.`, 'BAD_REQUEST')
    }
}