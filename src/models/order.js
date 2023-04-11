import { randomUUID } from 'crypto';
class Order{
    id
    products
    //TODO timestamp
    //TODO idClient
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
        //TODO products + cantidad prods: [ { prod: { id, name, description, price, image, }, cant: 2 }, { prod: { id, name, description, price, image, }, cant: 1 } ]
        this.products.push(product);
    }
    deleteProduct(productID){
        let index = -1;
        let i = 0;
        while(i < this.products.length && index === -1){
            if(this.products[i].id === productID){
                index = i;
            }
            i++;
        };
        (index !== -1) && this.products.splice(index,1);
    }
    hasProduct(idItem){
        for(let product of this.products){
            if(product.id === idItem){
                return true;
            }
        };
        return false;
    }
    async modify(order){
        await this.setProducts(order.products);
    }
    toDTO(){
        let productsDTO = []
        this.products.forEach(product => {
            const data = {
                id: product.getID(),
                ...product.toDTO()
            }
            productsDTO.push(data);
        });
        const dto = {
            products: productsDTO
        }
        return dto
    }
    cleanOrder(){
        this.products = [];
    }
}
export default Order;