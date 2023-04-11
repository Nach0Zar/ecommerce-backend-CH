import { Error } from "../error/error.js";
import Service from "./service.js";
import Cart from "../models/cart.js";
import productService from "./productService.js";
import productAndCartIDsValidation from "../validations/productAndCartIDsValidation.js";
//TODO CREATE REPOSITORY

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
        let productListParsed = await productService.parseProducts(products)
        let newCart = new Cart(productListParsed);
        let cartID = await this.container.save(newCart);
        if(!cartID){
            throw new Error('There was an error creating the cart', 'INTERNAL_ERROR');
        }
        return cartID;
    }
    addProductToCart = async (cartID, productID) => {
        await productAndCartIDsValidation(cartID, productID);
        let cart = await this.container.getItemByID(cartID);
        let productToAdd = await productService.getProduct(productID);
        let parsedProducts = await productService.parseProducts(cart.products);
        let cartItem = new Cart(parsedProducts, cart.id);
        cartItem.addProduct(productToAdd);
        if(await this.container.modifyByID(cartItem.getID(), cartItem.toDTO())) {
            return cartItem.getProducts();
        }
        else{
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        } 
    }
    checkExistingCart = async (cartID) => {
        let cartFound = await this.container.getItemByID(cartID);
        return (cartFound !== null)
    }
    deleteAllProductsFromCart = async (cartID) => {
        if(!this.checkExistingCart(cartID)){
            throw new Error(`No cart was found with the id ${cartID}`, 'NOT_FOUND');
        }
        let cartFound = await this.container.getItemByID(cartID);
        let parsedProducts = await productService.parseProducts(cartFound.products)
        let cartItem = new Cart(parsedProducts, cartFound.id)
        cartItem.cleanCart();
        await this.container.modifyByID(cartItem.getID(), cartItem.toDTO())
        if(cartItem.getProducts().length > 0){            
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        }
    }
    deleteProductFromCartByID = async (cartID, productID) => {
        await productAndCartIDsValidation(cartID, productID);
        let cart = await this.container.getItemByID(cartID);
        let parsedProducts = await productService.parseProducts(cart.products);
        let cartItem = new Cart(parsedProducts, cart.id);
        if(!cartItem.hasProduct(productID)){
            throw new Error(`There was no product matching the ID ${productID} in the cart with ID ${cart.id}`, 'BAD_REQUEST')
        }
        cartItem.deleteProduct(productID);
        await this.container.modifyByID(cart.id, cartItem.toDTO())
    }
    purchaseCart = async (cartID) => {
        if(!this.checkExistingCart(cartID)){
            throw new Error(`No cart was found with the id ${cartID}`, 'NOT_FOUND');
        }
        let cartFound = await this.container.getItemByID(cartID);
        let parsedProducts = await productService.parseProducts(cartFound.products)
        let cartItem = new Cart(parsedProducts, cartFound.id);
        let cartProducts = cartItem.getProducts();
        if(cartProducts.length > 0){
            cartItem.cleanCart();
            await this.deleteAllProductsFromCart(cartID);
            return cartProducts;
        }
        throw new Error(`No product was found in the cart`, 'NOT_FOUND');
    }
}
//TODO SINGLETON
const cartService = new CartService();
Object.freeze(cartService);
export default cartService;