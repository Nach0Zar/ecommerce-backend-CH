import { Error } from "../error/error.js";

export default function productDataValidation(title, price, image, description) {
    if(title === ""){
        throw new Error(`The product title can not be empty.`, 'BAD_REQUEST')
    }
    if(price === ""){
        throw new Error(`The product price can not be empty.`, 'BAD_REQUEST')
    }
    if(image === ""){
        throw new Error(`The product image can not be empty.`, 'BAD_REQUEST')
    }
    if(description === ""){
        throw new Error(`The product description can not be empty.`, 'BAD_REQUEST')
    }
    if(isNaN(price)){
        throw new Error(`The product price must be a number.`, 'BAD_REQUEST')
    }
    if(+price < 0){
        throw new Error(`The product price can not be negative.`, 'BAD_REQUEST')
    }
    if(+price === 0){
        throw new Error(`The product price can not be zero.`, 'BAD_REQUEST')
    }
}