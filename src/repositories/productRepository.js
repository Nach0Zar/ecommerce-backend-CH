import Product from '../models/product.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class ProductsRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("products");
    }
    parseItems(productsDTOs){
        let parsedProducts = [];
        productsDTOs.forEach((product)=>{
            parsedProducts.push(new Product(product));
        })
        return parsedProducts;
    }
    async save(product) {
        return await this.#dao.save(product.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new Product(dto)
    }
    async getAllItems(){
        let productsDTOs = await this.#dao.getAllItems();
        if (!productsDTOs) return null
        if (productsDTOs.length === 1 || productsDTOs.length === undefined) {
            return new Product(productsDTOs[0])
        }
        else{
            return this.parseItems(productsDTOs);
        }
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === undefined) return new Product(dtos);
        if (dtos.length === 1) {
            return new Product(dtos[0]);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newProduct){
        let updateInfo = {
            name: newProduct.name,
            price: newProduct.price,
            image: newProduct.image,
            description: newProduct.description
        }
        return await this.#dao.modifyByID(id, updateInfo);
    }
    async deleteByID(id){
        return this.#dao.deleteByID(id)
    }
    static getInstance(){
        if(!instance){
            instance = new ProductsRepository();
        }
        return instance;
    }
}
export default ProductsRepository.getInstance();