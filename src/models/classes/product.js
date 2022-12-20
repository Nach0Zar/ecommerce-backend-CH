import { randomUUID } from 'crypto';
class Product{
    title
    price
    thumbnail
    id
    constructor(title, price, thumbnail, id = randomUUID()){
        this.title = title
        this.price = +price
        this.thumbnail = thumbnail
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
    toDTO(){
        const dto = {
            title: this.title,
            price: this.price,
            thumbnail: this.thumbnail
        }
        return dto
    }
}
export default Product;