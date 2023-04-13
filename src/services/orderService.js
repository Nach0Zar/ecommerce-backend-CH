import { Error } from "../error/error.js";
import MongoDBContainer from "../containers/mongoDBContainer.js";
//TODO CREATE REPOSITORY

class OrderService{
    constructor(){
        this.container = new MongoDBContainer("orders")
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