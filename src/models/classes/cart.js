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
        //this is due to different id tags in mongodb/firestore/fs
        if(this._id){
            return this._id;
        }
        else{
            return this.id;
        }
    }
    setID(id){
        if(this._id){
            this._id = id;
        }
        else{
            this.id = id;
        }
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
    async modify(cart){
        await this.setProducts(cart.products);
    }
}
export default Cart;