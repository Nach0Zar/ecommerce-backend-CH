import { Error } from "../error/error.js";
import cartRepository from "../repositories/cartRepository.js";
import Cart from "../models/cart.js";
import userService from "./userService.js";
import productService from "./productService.js";
import productAndEmailsValidation from "../validations/productAndEmailsValidation.js";

let instance = null;

class CartService{
    constructor(){
        this.container = cartRepository;
    }
    getCartProducts = async (userEmail) => {
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart)
        if(!cart){   
            throw new Error(`No cart was found with the id ${user.cart}`, 'NOT_FOUND');
        }
        return cart.products.map(async (product)=>{
            return {idProd: await productService.getItemByID(product.idProd).toDTO(), qty: product.qty}
        });
    }
    createCart = async (products = []) => {
        let newCart = new Cart({products: products});
        let cartID = await this.container.save(newCart);
        if(!cartID){
            throw new Error('There was an error creating the cart', 'INTERNAL_ERROR');
        }
        return cartID;
    }
    addProductToCart = async (userEmail, productID) => {
        await productAndEmailsValidation(userEmail, productID);
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart);
        let productToAdd = await productService.getProduct(productID);
        cart.addProduct(productToAdd);
        if(await this.container.modifyByID(cart.getID(), cart.toDTO())) {
            return cart.getProducts();
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
        let cartItem = await this.container.getItemByID(cartID);
        await this.container.modifyByID(cartItem.getID(), {id: cartItem.getID(), products: []});
        cartItem = await this.container.getItemByID(cartID);
        if(cartItem.getProducts().length > 0){            
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        }
    }
    deleteProductFromCart = async (email, productID) => {
        await productAndEmailsValidation(email, productID);
        let user = await userService.getUserInformation(userEmail);
        let cart = await this.container.getItemByID(user.cart);
        if(!cart.hasProduct(productID)){
            throw new Error(`There was no product matching the ID ${productID} in the cart with ID ${cart.id}`, 'BAD_REQUEST')
        }
        cart.deleteProduct(productID);
        if(!(await this.container.modifyByID(cart.getID(), cart.toDTO()))) {
            throw new Error(`There was an error modifing the cart`, 'INTERNAL_ERROR') 
        }
    }
    purchaseCart = async (cartID) => {
        if(!this.checkExistingCart(cartID)){
            throw new Error(`No cart was found with the id ${cartID}`, 'NOT_FOUND');
        }
        let cart = await this.container.getItemByID(cartID);
        let cartProducts = cart.getProducts();
        if(cartProducts.length > 0){
            cart.cleanCart();
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