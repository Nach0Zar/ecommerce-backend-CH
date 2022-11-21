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
    getTitle = () => {
        return this.title;
    }
    setTitle = (title) => {
        this.title = title;
    }
    getPrice = () => {
        return this.price;
    }
    setPrice = (price) => {
        this.price = price;   
    }
    setThumbnail = () => {
        return this.thumbnail;
    }
    getThumbnail = (thumbnail) => {
        this.thumbnail = thumbnail;  
    }
    getID = () => {
        return this.id;
    }
    modifyProduct = (title, price, thumbnail) => {
        this.setTitle(title);
        this.setPrice(price);
        this.setThumbnail(thumbnail);
    }
}
export default Product;