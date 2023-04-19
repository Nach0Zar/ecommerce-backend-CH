import { randomUUID } from 'crypto';
class Product{
    title
    price
    image
    id
    constructor(title, price, image, description, id = randomUUID()){
        this.title = title;
        this.price = +price;
        this.image = image;
        this.description = description;
        this.id = id;
    }
    getTitle(){
        return this.title;
    }
    setTitle(title){
        this.title = title;
    }
    getPrice(){
        return this.price;
    }
    setPrice(price){
        this.price = price;   
    }
    setImage(){
        return this.image;
    }
    getImage(image){
        this.image = image;  
    }
    getDescription(){
        return this.description;
    }
    setDescription(description){
        this.description = description;
    }
    getID(){
        return this.id;
    }
    setID(id){
        this.id = id;
    }
    toDTO(){
        const dto = {
            title: this.title,
            price: this.price,
            image: this.image
        }
        return dto
    }
}
export default Product;