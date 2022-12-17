import { mongoDatabase } from '../../db/mongoClient.js';
import Container from './container.js';
class MongoDBContainer extends Container {

    constructor(dataType) {
        super(dataType);
        this.items = mongoDatabase.collection(dataType);
    }

    async save(object) {
        await this.items.insertOne(object)
    }

    async getItemByID(itemID) {
        let criterio = { id: itemID };
        return await this.items.find(criterio).toArray();
    }
    async getAllItems(){
        return await this.items.find({}).toArray();
    }
    async modifyByID(idItem, newItemParam){
        let index = this.items.map((item => item.id)).indexOf(idItem);
        this.items[index].modify(newItemParam);
        await this.saveDataOnFile();
    }
    async deleteByID(idItem){
        let index = this.items.map((item => item.id)).indexOf(idItem);
        (index !== -1) && this.items.splice(index,1);
        await this.saveDataOnFile();
    }
}
export default MongoDBContainer;
