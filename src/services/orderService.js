import { Error } from "../error/error.js";
import mailer from "../utils/mailer.js";
import config from "../config/config.js";
import orderRepository from "../repositories/orderRepository.js";
import Order from "../models/order.js";
import userService from "./userService.js";
import cartService from "./cartService.js";
import productService from "./productService.js";

let instance = null;

class OrderService{
    constructor(){
        this.container = orderRepository;
    }
    getOrder = async (orderID) => {
        let order = await this.container.getItemByID(orderID)
        if(!order){
            throw new Error(`No order was found with the id ${orderID}`, 'NOT_FOUND');
        }            
        return order.toDTO();
    }
    getUserOrders = async (userEmail) => {
        let user = await userService.getUserInformation(userEmail);
        let orders = await this.container.getItemByCriteria({idClient: user.id})
        if(!orders || orders.length == 0){
            throw new Error(`No order was found for the user with the email ${userEmail}`, 'NOT_FOUND');
        }       
        if(orders.length === undefined) {
            return orders.toDTO();
        }
        let ordersDTO = [];
        orders.forEach(order => {
            ordersDTO.push(order.toDTO())
        });
        return ordersDTO;
    }
    parseProducts = async (productList = []) => {
        let parsedProducts = [];
        for(let listedProduct in productList){
            let product = await productService.getProduct(productList[listedProduct].idProd);
            parsedProducts.push({prod: product, qty: productList[listedProduct].qty});

        }
        return parsedProducts;
    }
    purchaseCart = async (userEmail) => {
        let user = await userService.getUserInformation(userEmail);
        let productsBougth = await this.parseProducts(await cartService.purchaseCart(user.cart));
        let timestamp = new Date().toLocaleString();
        let order = new Order({
            products: productsBougth, 
            idClient: user.id, 
            timestamp: timestamp}
        );
        let productsBougthNames = [];
        productsBougth.forEach(product => {
            productsBougthNames.push(product.prod.name);
        });
        mailer.send({
            to: config.MAIL_ADMIN,
            subject: `New purchase order: ${user.name} ${user.lastname} - ${userEmail}`,
            text: `Products purchased: ${productsBougthNames.join(", ")}`
        })
        mailer.send({
            to: userEmail,
            subject: `Purchase order processed!`,
            text: `Products purchased: ${productsBougthNames.join(", ")}`
        })
        let orderID = await this.container.save(order);
        return orderID;
    }
    static getInstance(){
        if(!instance){
            instance = new OrderService();
        }
        return instance;
    }
}
export default OrderService.getInstance();