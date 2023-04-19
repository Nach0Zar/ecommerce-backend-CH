import { randomUUID } from 'crypto';
class Product{
    #title
    #price
    #image
    #description
    #id
    constructor({title, price, image, description, id = randomUUID()}){
        this.#title = title;
        this.#price = +price;
        this.#image = image;
        this.#description = description;
        this.#id = id;
    }
    getTitle(){
        return this.#title;
    }
    setTitle(title){
        this.#title = title;
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
    modify({title, price, image, description}){
        this.setTitle(title);
        this.setPrice(price);
        this.setImage(image);
        this.setDescription(description);
    }
    toDTO(){
        const dto = {
            title: this.#title,
            price: this.#price,
            image: this.#image,
            description: this.#description,
            id: this.#id
        }
        return dto
    }
}
export default Product;