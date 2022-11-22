import Container from "./container.js";
import fs from 'fs';
import Product from "./product.js";
import Cart from "./cart.js";
import * as url from 'url';
class CartContainerClass extends Container{
    constructor(){
        super();
        this.filePath = url.fileURLToPath(new URL('.', import.meta.url))+"../carts.txt";
       //if file exists and it is not empty
       if(this.fs.existsSync(this.filePath) && this.fs.readFileSync(this.filePath,'utf8').length > 0){
        //loads previous items to the list
            let list = JSON.parse(this._fs.readFileSync(filePath,'utf8'));
            this._items = [];
            list.forEach(cart => {
                let productParsed = [];
                cart.products.forEach(listedProduct => {
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                    product.setID(listedProduct.id);
                    productParsed.push(product);
                });
                this._items.push(new Cart(productParsed));
            })
        }
    }
}
const cartContainer = new CartContainerClass
export default cartContainer;