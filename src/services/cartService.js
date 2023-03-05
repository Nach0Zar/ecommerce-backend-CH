import { Error } from "../error/error.js";
import Service from "./service.js";
import Cart from "../models/cart.js";
import productService from "./productService.js";
import productValidation from "../validations/productValidation.js";
import addProductToCartValidation from "../validations/addProductToCartValidation.js";

class CartService extends Service{
    constructor(){
        super("carts")
    }
    getCartProducts = async (cartID) => {
        let cart = await this.container.getItemByID(cartID)
        if(!cart){   
            throw new Error(`No cart was found with the id ${cartID}`, 'NOT_FOUND');
        }
        return cart.products;
    }
    createCart = async (products = []) => {
        let productListParsed = [];
        for(const listedProduct of products){
            let product = await productService.getProduct(listedProduct.id);
            productValidation(listedProduct, product);
            productListParsed.push(product);
        }
        let newCart = new Cart(productListParsed);
        let cartID = await this.container.save(newCart);
        if(!cartID){
            throw new Error('There was an error creating the cart', 'INTERNAL_ERROR');
        }
        return cartID;
    }
    addProductToCart = async (cartID, productID) => {
        await addProductToCartValidation(cartID, productID);
        let cart = await this.container.getItemByID(cartID);
        let product = await productService.getProduct(productID);
    }
    checkExistingCart = async (cartID) => {
        let cartFound = await this.container.getItemByID(cartID);
        return (cartFound !== null)
    }
}
const cartService = new CartService();
Object.freeze(cartService);
export default cartService;