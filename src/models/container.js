import fs from 'fs';
import Product from './product.js';
import Cart from './cart.js';
class Container{
    #fs;
    #items;
    #filePath;
    constructor(filePath){
        this.#filePath = filePath;
        this.#fs = fs;
        //if file doesn't exists or if it is empty
        if(!fs.existsSync(filePath) || fs.readFileSync(filePath,'utf8').length == 0){
            this.#items = [];
        }
        else{
            //loads previous items to the list
            let list = JSON.parse(fs.readFileSync(filePath,'utf8'));
            this.#items = [];
            //checks if it is a product container or cart container.
            //this part will be deleted when DB is implemented as no container will be needed
            if (list[0].title !== undefined){
                list.forEach(listedProduct => {
                    let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                    product.setID(listedProduct.id);
                    this.#items.push(product);
                });
            }
            else{
                list.forEach(cart => {
                    let productParsed = [];
                    cart.products.forEach(listedProduct => {
                        let product = new Product(listedProduct.title, listedProduct.price, listedProduct.thumbnail);
                        product.setID(listedProduct.id);
                        productParsed.push(product);
                    });
                    this.#items.push(new Cart(productParsed));
                })
            }
        }
    }
    deleteFile = async () => {
        this.#fs.promises.unlink(this.#filePath)
        .then(()=>console.log("Información eliminada!"))
        .catch(()=>console.log("El archivo no fue encontrado"));
    }
    writeData = async (stringToWrite) => {
        this.#fs.promises.writeFile(this.#filePath,stringToWrite)
        .then(()=>console.log("Información guardada!"))
        .catch(()=>console.log("Falló la carga de información"));
    }
    saveDataOnFile = async () => {
        this.deleteFile()
        .then(()=>this.writeData(JSON.stringify(this.#items)))
        .catch(()=>console.log("Falló el borrado de archivo"));
    }
    save = async (object) => {
        this.#items.push(object);
        //await this.saveDataOnFile();
    }
    getAllItems= () => {
        return this.#items;
    }
    getItemByID = (idItem) => {
        //creates a new array (with the map function) containing only the IDs from the list of items, then indexes by ID and returns the item or null if the index was -1
        let index = this.#items.map((item => item.id)).indexOf(idItem);
        return (index !== -1) ? this.#items[index] : null;
    }
    modifyItemByID = async (idItem, newItemParam) => {
        let index = this.#items.map((item => item.id)).indexOf(idItem);
        this.#items[index].modifyProduct(newItemParam.title, newItemParam.price, newItemParam.thumbnail);
        //await this.saveDataOnFile();
    }
}
export default Container;