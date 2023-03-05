import { Error } from "../error/error.js";
import Product from "../models/product.js";
import Service from "./service.js";
import productValidation from "../validations/productValidation.js";
import productDataValidation from "../validations/productDataValidation.js";

class ProductService extends Service{
    constructor(){
        super("products")
    }
    getProduct = async (productID) => {
        if(!(await this.checkExistingProduct(productID))){
            throw new Error(`No product was found matching ID ${productID}`, 'BAD_REQUEST');
        }
        let productFound = await this.container.getItemByID(productID);
        return new Product(productFound.title, productFound.price, productFound.thumbnail, productFound.id);
    }
    checkExistingProduct = async (productID) => {
        let productFound = await this.container.getItemByID(productID);
        return (productFound !== null);
    }
    parseProducts = async (productList = []) => {
        let parsedProducts = [];
        for(const listedProduct in productList){
            let product = await productService.getProduct(listedProduct.id);
            productValidation(listedProduct, product);
            parsedProducts.push(product);
        }
        return parsedProducts;
    }
    getAllItems = async () => {
        let items = await this.container.getAllItems();
        let parsedProducts = this.parseProducts(items);
        if(parsedProducts < 1){
            throw new Error(`No product was found`, 'BAD_REQUEST');
        }
        return parsedProducts;
    }
    modifyProductByID = async (productID, productNewData) => {
        if(!(await this.checkExistingProduct(productID))){
            throw new Error(`No product was found matching ID ${productID}`, 'BAD_REQUEST');
        }
        let productFound = await this.container.getItemByID(productID);
        let parsedProduct = new Product(productFound.title, productFound.price, productFound.thumbnail, productFound.id)
        parsedProduct.modify(productNewData);
        if(await this.container.modifyByID(productID, productNewData)){
            return parsedProduct;
        }
        else{
            throw new Error(`There was an error modifing the product`, 'INTERNAL_ERROR') 
        } 
    }
    createProduct = async (title, price, thumbnail) => {
        productDataValidation(title, price, thumbnail);
        let newProduct = new Product(title, +price, thumbnail);
        let productID = await this.container.save(newProduct);
        if(!productID){
            throw new Error(`There was an error creating the product`, 'INTERNAL_ERROR') 
        }
        newProduct.setID(productID);
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
}
const productService = new ProductService();
Object.freeze(productService);
export default productService;