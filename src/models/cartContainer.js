import Container from "./container.js";
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
            let list = JSON.parse(this.fs.readFileSync(this.filePath,'utf8'));
            list.forEach(cart => {
                let productParsed = [];
                cart.products.forEach(listedProduct => {
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                    product.setID(listedProduct.id);
                    productParsed.push(product);
                });
                let cartParsed = new Cart(productParsed);
                cartParsed.setID(cart.id)
                this.items.push(cartParsed);
            })
        }
    }
    async addProductToCart(cartID, product){
        let index = this.items.map((item => item.id)).indexOf(cartID);
        this.items[index].addProduct(product);
        await this.saveDataOnFile();
    }
    async deleteAllProductsInCart(cartID){
        let index = this.items.map((item => item.id)).indexOf(cartID);
        this.items[index].setProducts([]);
        await this.saveDataOnFile();
    }
    async deleteProductInCart(cartID, productID){
        let index = this.items.map((item => item.id)).indexOf(cartID);
        this.items[index].deleteProduct(productID);
        await this.saveDataOnFile();
    }
}
const cartContainer = new CartContainerClass();
export default cartContainer;