import Order from '../models/order.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class OrderRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("orders")
    }
    parseItems(ordersDTOs){
        let parsedOrders = [];
        ordersDTOs.forEach((order)=>{
            parsedOrders.push(new Order(order))
        })
        return parsedOrders;
    }
    async save(order) {
        return await this.#dao.save(order.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new Order(dto)
    }
    async getAllItems(){
        let ordersDTOs = await this.#dao.getAllItems();
        return this.parseItems(ordersDTOs);
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === undefined) return new Order(dtos);
        if (dtos.length === 1) {
            return new Order(dtos[0]);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newOrder){
        let updateInfo = {
            products: newOrder.products,
            idClient: newOrder.ddClient,    
            timestamp: newOrder.timestamp
        }
        return await this.#dao.modifyByID(id, updateInfo);
    }
    async deleteByID(id){
        return this.#dao.deleteByID(id)
    }
    static getInstance(){
        if(!instance){
            instance = new OrderRepository();
        }
        return instance;
    }
}
export default OrderRepository.getInstance();