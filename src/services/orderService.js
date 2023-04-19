import { Error } from "../error/error.js";
import mailer from "../utils/mailer.js";
import orderRepository from "../repositories/orderRepository.js";
import Order from "../models/order.js";
import userService from "./userService.js";
import productService from "./productService.js";
//TODO RETURN DTOs
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
        return order;
    }
    getUserOrders = async (userEmail) => {
        let user = await userService.getUserInformation(userEmail);
        let orders = await this.container.getItemByCriteria({idClient: user.getId()})
        if(!orders || orders.length == 0){
            throw new Error(`No order was found for the user with the email ${email}`, 'NOT_FOUND');
        }            
        return orders;
    }
    parseProducts = async (productList = []) => {
        let parsedProducts = [];
        productList.forEach(async listedProduct => {
            let product = await productService.getProduct(listedProduct.idProd);
            parsedProducts.push({prod: product, qty: listedProduct.qty});
        })
        return parsedProducts;
    }
    purchaseCart = async (userEmail) => {
        let user = await userService.getUserInformation(userEmail);
        let productsBougth = this.parseProducts(await cartService.purchaseCart(user.cart));
        let timestamp = new Date().getTime();
        let order = new Order({
            products: productsBougth, 
            idClient: user.id, 
            timestamp: timestamp}
        );
        let productsBougthNames = [];
        productsBougth.forEach(product => {
            productsBougthNames += product.prod.name;
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
        return order;
    }
    static getInstance(){
        if(!instance){
            instance = new OrderService();
        }
        return instance;
    }
}
export default OrderService.getInstance();