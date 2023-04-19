import { randomUUID } from 'crypto';
class Order{
    id
    idClient
    products
    timestamp
    constructor({products, idClient, timestamp, id = randomUUID()}){
        this.products = products;
        this.idClient = idClient;      
        this.timestamp = timestamp;  
        this.id = id;
    }
    getidClient(){
        return this.idClient;
    }
    setidClient(idClient){
        this.idClient = idClient;
    }
    getTimestamp(){
        return this.timestamp;
    }
    setTimestamp(timestamp){
        this.timestamp = timestamp;
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
    addProduct(productID){
        //prods: [ { prod: { id, name, description, price, image, }, cant: 2 }, { prod: { id, name, description, price, image, }, cant: 1 } ]
        if (this.hasProduct(prodproductIDuct)){
            this.products.map((product)=>{
                if(product.prod.id == productID){
                    product.qty++;
                }
            });
        }
        else{
            this.products.push({idProd: productID, qty: 1});
        }
    }
    deleteProduct(productID){
        let index = -1;
        let i = 0;
        while(i < this.products.length && index === -1){
            if(this.products[i].prod.id === productID){
                index = i;
            }
            i++;
        };
        if(index !== -1) {
            if(this.products[index].prod.qty === 1){
                this.products.splice(index,1);
            }
            else{
                this.products[index].prod.qty = this.products[index].prod.qty - 1;
            }
        }
    }
    hasProduct(idItem){
        for(let product of this.products){
            if(product.prod.id === idItem){
                return true;
            };
        };
        return false;
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