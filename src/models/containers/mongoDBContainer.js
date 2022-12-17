import { mongoDatabase } from '../../db/mongoClient.js';
import Container from './container.js';
import { ObjectID } from 'mongodb'
class MongoDBContainer extends Container {

    constructor(dataType) {
        super(dataType);
        this.items = mongoDatabase.collection(dataType);
    }

    async save(object) {
        delete object.id;//removes the object ID
        await this.items.insertOne(object)
    }

    async getItemByID(idItem) {
        let criterio = { _id: ObjectID(idItem) };
        let item = await this.items.find(criterio).toArray();
        if(!item.toString()){//to check if no doc was found
            item = null;
        }
        return (item[0])
    }
    async getAllItems(){
        let item = await this.items.find({}).toArray();
        if(!item.toString()){//to check if no doc was found
            item = null;
        }
        return item
    }
    async modifyByID(idItem, newItemParam){
        delete newItemParam.id;
        let query = await this.items.updateOne({ _id: ObjectID(idItem) }, { $set: newItemParam });
        return (query.modifiedCount > 0);
    }
    async deleteByID(idItem){
        let criterio = { _id: ObjectID(idItem) };
        let query = await this.items.deleteOne(criterio);
        return (query.deletedCount > 0);
    }
}
export default MongoDBContainer;
