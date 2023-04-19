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
        productsDTOs.foreach((product)=>{
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
        let productsDTOs = this.#dao.getAllItems();
        return this.parseItems(productsDTOs);
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === 1) {
            return new Product(dtos)
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newProduct){
        let updateInfo = {
            title: newProduct.getTitle(),
            price: newProduct.getPrice(),
            image: newProduct.getImage(),
            description: newProduct.getDescription()
        }
        await this.#dao.modifyByID(id, updateInfo);
    }
    async deleteById(id){
        this.#dao.deleteById(id)
    }
    static getInstance(){
        if(!instance){
            instance = new ProductsRepository();
        }
        return instance;
    }
}
export default ProductsRepository.getInstance();