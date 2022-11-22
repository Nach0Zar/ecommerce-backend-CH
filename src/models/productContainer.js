import Container from "./container.js";
import fs from 'fs';
import Product from "./product.js";
import * as url from 'url';
class ProductContainerClass extends Container{
    constructor(){
        super();
        this.filePath = url.fileURLToPath(new URL('.', import.meta.url))+"../products.txt";
        //if file doesn't exists or if it is empty
        if(!this.fs.existsSync(this.filePath) || this.fs.readFileSync(this.filePath,'utf8').length == 0){
            this.items = [];
        }
        else{
            //loads previous items to the list
            let list = JSON.parse(this.fs.readFileSync(this.filePath,'utf8'));
            this.items = [];
            list.forEach(listedProduct => {
                let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                product.setID(listedProduct.id);
                this.items.push(product);
            });
        }
    }
    modifyProductByID = async (idItem, newItemParam) => {
        let index = this.items.map((item => item.id)).indexOf(idItem);
        this.items[index].modifyProduct(newItemParam.title, newItemParam.price, newItemParam.thumbnail);
        //await this.saveDataOnFile();
    }
    async deleteItemByID(idItem){

    }
}
const productContainer = new ProductContainerClass();
export default productContainer;