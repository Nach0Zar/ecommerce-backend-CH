import fs from 'fs';
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
            this.#items = JSON.parse(fs.readFileSync(filePath,'utf8'))
        }
    }
    async deleteFile(){
        this.#fs.promises.unlink(this.#filePath)
        .then(()=>console.log("Información eliminada!"))
        .catch(()=>console.log("El archivo no fue encontrado"));
    }
    async writeData(stringToWrite){
        this.#fs.promises.writeFile(this.#filePath,stringToWrite)
        .then(()=>console.log("Información guardada!"))
        .catch(()=>console.log("Falló la carga de información"));
    }
    async saveDataOnFile(){
        this.deleteFile()
        .then(()=>this.writeData(JSON.stringify(this.#items)))
        .catch(()=>console.log("Falló el borrado de archivo"));
    }
    async save(object){
        this.#items.push(object);
        await this.saveDataOnFile();
    }
    getAllItems(){
        return this.#items;
    }
}
export default Container;