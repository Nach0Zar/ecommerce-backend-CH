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
    setID(id){
        this.id = id;
    }
    addProduct(product){
        this.products.push(product);
    }
    deleteProduct(productID){
        let index = this.products.map((item => item.id)).indexOf(productID);
        (index !== -1) && this.products.splice(index,1);
    }
    hasProduct(idItem){
        if(this.getProductByID(idItem) !== null){
            return true;
        }
        return false;
    }
    modify(products){
        this.products = products;
    }
}
export default Cart;