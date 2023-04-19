import { Error } from "../error/error.js";
import userService from "./userService.js";
import MongoDBContainer from "../containers/mongoDBContainer.js";
import Cart from "../models/cart.js";
import productService from "./productService.js";
import productAndEmailsValidation from "../validations/productAndEmailsValidation.js";
//TODO CREATE REPOSITORY + RETURN DTOs
let instance = null;

class CartService{
    constructor(){
        this.container = new MongoDBContainer("carts")
    }
    getCartProducts = async (userEmail) => {
        //TODO return product data and not product id only
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart)
        if(!cart){   
            throw new Error(`No cart was found with the id ${user.cart}`, 'NOT_FOUND');
        }
        return cart.products;
    }
    createCart = async (products = []) => {
        let newCart = new Cart(products);
        let cartID = await this.container.save(newCart);
        if(!cartID){
            throw new Error('There was an error creating the cart', 'INTERNAL_ERROR');
        }
        return cartID;
    }
    addProductToCart = async (userEmail, productID) => {
        await productAndEmailsValidation(userEmail, productID);
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart)
        let productToAdd = await productService.getProduct(productID);
        let cartItem = new Cart(cart.products, cart.id);
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
        let cartItem = new Cart([], cartFound.id);
        await this.container.modifyByID(cartItem.getID(), cartItem.toDTO())
        if(cartItem.getProducts().length > 0){            
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        }
    }
    deleteProductFromCart = async (email, productID) => {
        await productAndEmailsValidation(email, productID);
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart);
        let cartItem = new Cart(cart.products, cart.id);
        if(!cartItem.hasProduct(productID)){
            throw new Error(`There was no product matching the ID ${productID} in the cart with ID ${cart.id}`, 'BAD_REQUEST')
        }
        cartItem.deleteProduct(productID);
        if(!(await this.container.modifyByID(cartItem.getID(), cartItem.toDTO()))) {
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        }
    }
    purchaseCart = async (cartID) => {
        if(!this.checkExistingCart(cartID)){
            throw new Error(`No cart was found with the id ${cartID}`, 'NOT_FOUND');
        }
        let cartFound = await this.container.getItemByID(cartID);
        let cartItem = new Cart(parsedProducts, cartFound.id);
        let cartProducts = cartItem.getProducts();
        if(cartProducts.length > 0){
            cartItem.cleanCart();
            await this.deleteAllProductsFromCart(cartID);
            return cartProducts;
        }
        throw new Error(`No product was found in the cart`, 'NOT_FOUND');
    }
    static getInstance(){
        if(!instance){
            instance = new CartService();
        }
        return instance;
    }
}
export default CartService.getInstance();