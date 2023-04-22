import { Error } from "../error/error.js";
import productRepository from "../repositories/productRepository.js";
import Product from "../models/product.js";
import productDataValidation from "../validations/productDataValidation.js";

let instance = null;

class ProductService{
    constructor(){
        this.container = productRepository;
    }
    getProduct = async (productID) => {
        if(!(await this.checkExistingProduct(productID))){
            throw new Error(`No product was found matching ID ${productID}`, 'BAD_REQUEST');
        }
        return (await this.container.getItemByID(productID)).toDTO();
    }
    checkExistingProduct = async (productID) => {
        let productFound = await this.container.getItemByID(productID);
        return (productFound !== null && productFound.length !== 0);
    }
    getAllItems = async () => {
        let items = await this.container.getAllItems();
        if(items < 1){
            throw new Error(`No product was found`, 'BAD_REQUEST');
        }
        if(items.length === undefined){
            return items.toDTO();
        }
        let itemsDTO = [];
        items.forEach(product => {
            itemsDTO.push(product.toDTO())
        });
        return itemsDTO;
    }
    modifyProductByID = async (productID, productNewData) => {
        if(!(await this.checkExistingProduct(productID))){
            throw new Error(`No product was found matching ID ${productID}`, 'BAD_REQUEST');
        }
        let productFound = await this.container.getItemByID(productID);
        productFound.modify(productNewData);
        if(await this.container.modifyByID(productID, productNewData)){
            return productFound.toDTO();
        }
        else{
            throw new Error(`There was an error modifing the product`, 'INTERNAL_ERROR') 
        } 
    }
    createProduct = async (name, price, image, description) => {
        productDataValidation(name, price, image, description);
        let newProduct = new Product({
            name: name, 
            price: +price, 
            image: image,
            description: description}
        );
        let productID = await this.container.save(newProduct);
        if(!productID){
            throw new Error(`There was an error creating the product`, 'INTERNAL_ERROR') 
        }
        return productID;
    }
    deleteProduct = async (productID) => {
        if(!(await this.checkExistingProduct(productID))){
            throw new Error(`No product was found matching ID ${productID}`, 'BAD_REQUEST');
        }
        if(!(await this.container.deleteByID(productID))){
            throw new Error(`There was an error deleting the product`, 'INTERNAL_ERROR') 
        }
    }
    static getInstance(){
        if(!instance){
            instance = new ProductService();
        }
        return instance;
    }
}
export default ProductService.getInstance();