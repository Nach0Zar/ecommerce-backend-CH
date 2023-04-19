import { Error } from "../error/error.js";
import MongoDBContainer from "../containers/mongoDBContainer.js";
//TODO CREATE REPOSITORY
let instance = null;

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
    static getInstance(){
        if(!instance){
            instance = new OrderService();
        }
        return instance;
    }
}
export default OrderService.getInstance();