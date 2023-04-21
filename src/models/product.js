import { randomUUID } from 'crypto';
class Product{
    #name
    #price
    #image
    #description
    #id
    constructor({name, price, image, description, id = randomUUID()}){
        this.#name = name;
        this.#price = +price;
        this.#image = image;
        this.#description = description;
        this.#id = id;
    }
    getName(){
        return this.#name;
    }
    setName(name){
        this.#name = name;
    }
    getPrice(){
        return this.#price;
    }
    setPrice(price){
        this.#price = price;   
    }
    setImage(){
        return this.#image;
    }
    getImage(image){
        this.#image = image;  
    }
    getDescription(){
        return this.#description;
    }
    setDescription(description){
        this.#description = description;
    }
    getID(){
        return this.#id;
    }
    setID(id){
        this.#id = id;
    }
    modify({name, price, image, description}){
        this.setName(name);
        this.setPrice(price);
        this.setImage(image);
        this.setDescription(description);
    }
    toDTO(){
        const dto = {
            name: this.#name,
            price: this.#price,
            image: this.#image,
            description: this.#description,
            id: this.#id
        }
        return dto
    }
}
export default Product;