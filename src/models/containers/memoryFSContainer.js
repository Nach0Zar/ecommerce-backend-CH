import fs from 'fs';
import Container from './container.js';
import * as url from 'url';
import Product from "../classes/product.js";
import Cart from "../classes/cart.js";

class MemoryFSContainer extends Container{
    constructor(dataType){
        super(dataType);
        this.items = []
        this.filePath = url.fileURLToPath(new URL('.', import.meta.url))+"../../"+dataType+".txt";
        this.fs = fs;
        //if file exists and it is not empty
        if(dataType === "carts"){
            if(this.fs.existsSync(this.filePath) && this.fs.readFileSync(this.filePath,'utf8').length > 0){
                //loads previous items to the list
                let list = JSON.parse(this.fs.readFileSync(this.filePath,'utf8'));
                list.forEach(cart => {
                    let productParsed = [];
                    cart.products.forEach(listedProduct => {
                        let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id);
                        productParsed.push(product);
                    });
                    let cartParsed = new Cart(productParsed);
                    cartParsed.setID(cart.id)
                    this.items.push(cartParsed);
                })
            }
        }
        else if(dataType === "products"){
            //if file exists and it is not empty
            if(this.fs.existsSync(this.filePath) && this.fs.readFileSync(this.filePath,'utf8').length > 0){
                //loads previous items to the list
                let list = JSON.parse(this.fs.readFileSync(this.filePath,'utf8'));
                list.forEach(listedProduct => {
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail, listedProduct.id);
                    this.items.push(product);
                });
            }
        }
    }
    async deleteFile(){
        await this.fs.promises.unlink(this.filePath)
        .then(()=>console.log("Información eliminada!"))
        .catch(()=>console.log("El archivo no fue encontrado"));
    }
    async writeData(stringToWrite){
        await this.fs.promises.writeFile(this.filePath,stringToWrite)
        .then(()=>console.log("Información guardada!"))
        .catch(()=>console.log("Falló la carga de información"));
    }
    async saveDataOnFile(){
        let fileChange;
        await this.deleteFile()
        .then(async ()=>{
            await this.writeData(JSON.stringify(this.items))
            fileChange = true
        }).catch(()=>{
            console.log("Falló el borrado de archivo");
            fileChange = false
        });
        return fileChange;
    }
    async save(object){
        this.items.push(object);
        await this.saveDataOnFile();
        return object.id;
    }
    async getAllItems(){
        return this.items;
    }
    async getItemByID(idItem){
        //creates a new array (with the map function) containing only the IDs from the list of items, then indexes by ID and returns the item or null if the index was -1
        let index = this.items.map((item => item.id)).indexOf(idItem);
        return (index !== -1) ? this.items[index] : null;
    }
    async modifyByID(idItem, newItemParam){
        let index = this.items.map((item => item.id)).indexOf(idItem);
        await this.items[index].modify(newItemParam);
        let changed = await this.saveDataOnFile();
        return changed;
    }
    async deleteByID(idItem){
        let index = this.items.map((item => item.id)).indexOf(idItem);
        (index !== -1) && this.items.splice(index,1);
        return await this.saveDataOnFile();
    }
}
export default MemoryFSContainer;