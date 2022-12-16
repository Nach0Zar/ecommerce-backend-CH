import Model from "./model.js"
class ModelCartsClass extends Model{
    constructor(){
        super("carts");
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
const modelCarts = new ModelCartsClass();
export default modelCarts;