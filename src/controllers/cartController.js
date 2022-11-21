import * as url from 'url';
import Container from '../models/container.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
class cartControllerClass{
    #container
    constructor(){
        let filepath = url.fileURLToPath(new URL('.', import.meta.url))+"../carts.txt";
        this.#container = new Container(filepath);
    }
}
const cartController = new cartControllerClass
Object.freeze(cartController);
export default cartController;