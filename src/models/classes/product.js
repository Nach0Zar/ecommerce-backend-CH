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