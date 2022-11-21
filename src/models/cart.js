import { randomUUID } from 'crypto';
class Cart{
    id
    products
    constructor(products){
        this.products = products;
        this.id = randomUUID();
    }
    getProducts(){
        return this.products;
    }
    setProducts(products){
        this.products = products;
    }
    getProductByID(idItem){
        let index = this.products.map((item => item.id)).indexOf(idItem);
        return (index !== -1) ? this.products[index] : null;
    }
    getID(){
        return this.id;
    }
    modifyProductByID(title, price, thumbnail){
        let index = this.products.map((item => item.id)).indexOf(idItem);
        this.products[index].modifyProduct(title, price, thumbnail);
    }
}
export default Cart;