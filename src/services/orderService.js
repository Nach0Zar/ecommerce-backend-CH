import { Error } from "../error/error.js";
import Service from "./service.js";
//TODO CREATE REPOSITORY

class OrderService extends Service{
    constructor(){
        super("orders")
    }
    getOrder = async (id) => {
        let user = await this.container.getItemByID(id)
        if(!user){
            throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
        }            
        return user;
    }
}
//TODO SINGLETON
const orderService = new OrderService();
Object.freeze(orderService);
export default orderService;