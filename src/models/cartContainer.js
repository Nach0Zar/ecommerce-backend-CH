import Container from "./container.js";
import fs from 'fs';
import Product from "./product.js";
import Cart from "./cart.js";
import * as url from 'url';
class CartContainerClass extends Container{
    filePath;
    constructor(){
        super();
        this.filePath = url.fileURLToPath(new URL('.', import.meta.url))+"../carts.txt";
        //if file doesn't exists or if it is empty
        if(!this._fs.existsSync(filePath) || this._fs.readFileSync(filePath,'utf8').length == 0){
            this._items = [];
        }
        else{
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