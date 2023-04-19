import Cart from '../models/cart.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class CartRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("carts")
    }
    parseItems(cartsDTOs){
        let parsedCarts = [];
        cartsDTOs.foreach((cart)=>{
            parsedCarts.push(new Cart(cart))
        })
        return parsedCarts;
    }
    async save(cart) {
        return await this.#dao.save(cart.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new Cart(dto)
    }
    async getAllItems(){
        let cartsDTOs = this.#dao.getAllItems();
        return this.parseItems(cartsDTOs);
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length > 1) {
            return new Cart(dtos)
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newCart){
        let updateInfo = {
            products: newCart.getProducts()
        }
        await this.#dao.modifyByID(id, updateInfo);
    }
    async deleteById(id){
        this.#dao.deleteById(id)
    }
    static getInstance(){
        if(!instance){
            instance = new CartRepository();
        }
        return instance;
    }
}
export default CartRepository.getInstance();