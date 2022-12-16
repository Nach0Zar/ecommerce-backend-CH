import { randomUUID } from 'crypto';
class Product{
    title
    price
    thumbnail
    id
    constructor(title, price, thumbnail){
        this.title = title
        this.price = +price
        this.thumbnail = thumbnail
        this.id = randomUUID();
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
    setThumbnail(){
        return this.thumbnail;
    }
    getThumbnail(thumbnail){
        this.thumbnail = thumbnail;  
    }
    getID(){
        return this.id;
    }
    setID(id){
        this.id = id;
    }
    modify(item){
        this.setTitle(item.title);
        this.setPrice(item.price);
        this.setThumbnail(item.thumbnail);
    }
}
export default Product;