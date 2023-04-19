import { randomUUID } from 'crypto';
class Cart{
    #id
    #products
    constructor({products, id = randomUUID()}){
        this.#products = products;
        this.#id = id;
    }
    getProducts(){
        return this.#products;
    }
    setProducts(products){
        this.#products = products;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    addProduct(productID){
        //prods: [ { idProd: 1, cant: 2 }, { idProd: 2, cant: 5} ]
        if (this.hasProduct(productID)){
            this.#products.map((product)=>{
                if(product.idProd === productID){
                    product.qty++;
                }
            });
        }
        else{
            this.#products.push({idProd: productID, qty: 1});
        }
    }
    deleteProduct(productID){
        let index = -1;
        let i = 0;
        while(i < this.#products.length && index === -1){
            if(this.#products[i].idProd === productID){
                index = i;
            }
            i++;
        };
        if(index !== -1) {
            if(this.#products[index].qty === 1){
                this.#products.splice(index,1);
            }
            else{
                this.#products[index].qty = this.#products[index].qty - 1;
            }
        }
    };
    hasProduct(idItem){
        for(let product of this.#products){
            if(product.idProd === idItem){
                return true;
            }
        };
        return false;
    }
    toDTO(){
        const dto = {
            products: this.#products,
            id: this.#id
        }
        return dto
    }
    cleanCart(){
        this.#products = [];
    }
}
export default Cart;