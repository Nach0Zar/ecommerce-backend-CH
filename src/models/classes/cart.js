import { randomUUID } from 'crypto';
class Cart{
    id
    products
    constructor(products, id = randomUUID()){
        this.products = products;
        this.id = id;
    }
    getProducts(){
        return this.products;
    }
    setProducts(products){
        this.products = products;
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
        let index = -1;
        let i = 0;
        while(i < this.products.length && index === -1){
            if(this.products[i].id === productID || (this.products[i]._id).toString() === productID){//in case of using mongodb, the product has _id and is ObjectID type, so it must be parsed to be matched
                index = i;
            }
            i++;
        };
        (index !== -1) && this.products.splice(index,1);
    }
    hasProduct(idItem){
        for(let product of this.products){
            if(product.id === idItem || (product._id).toString() === idItem){//in case of using mongodb, the product has _id and is ObjectID type, so it must be parsed to be matched
                return true;
            }
        };
        return false;
    }
    async modify(cart){
        await this.setProducts(cart.products);
    }
    toDTO(){
        let productsDTO = []
        this.products.forEach(product => {
            productsDTO.push(product.toDTO());
        });
        const dto = {
            products: productsDTO
        }
        return dto
    }
}
export default Cart;