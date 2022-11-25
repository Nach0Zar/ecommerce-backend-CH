import fs from 'fs';
import Product from './product.js';
import Cart from './cart.js';
class Container{
    fs;
    items;
    filePath;
    constructor(){
        this.filePath = "";
        this.fs = fs;
        this.items = [];
    }
    async deleteFile(){
        this.fs.promises.unlink(this.filePath)
        .then(()=>console.log("Información eliminada!"))
        .catch(()=>console.log("El archivo no fue encontrado"));
    }
    async writeData(stringToWrite){
        this.fs.promises.writeFile(this.filePath,stringToWrite)
        .then(()=>console.log("Información guardada!"))
        .catch(()=>console.log("Falló la carga de información"));
    }
    async saveDataOnFile(){
        this.deleteFile()
        .then(()=>this.writeData(JSON.stringify(this.items)))
        .catch(()=>console.log("Falló el borrado de archivo"));
    }
    async save(object){
        this.items.push(object);
        //await this.saveDataOnFile();
    }
    getAllItems(){
        return this.items;
    }
    getItemByID(idItem){
        //creates a new array (with the map function) containing only the IDs from the list of items, then indexes by ID and returns the item or null if the index was -1
        let index = this.items.map((item => item.id)).indexOf(idItem);
        return (index !== -1) ? this.items[index] : null;
    }
}
export default Container;