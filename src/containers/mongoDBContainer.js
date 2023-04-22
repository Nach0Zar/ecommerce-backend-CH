import { mongoDatabase } from '../db/mongoClient.js';
import { ObjectId } from 'mongodb'
export default class MongoDBContainer {
    constructor(dataType) {
        this.items = mongoDatabase.collection(dataType);
    }
    async save(object) {
        delete object.id;//removes the object ID
        return (await this.items.insertOne(object)).insertedId.toString()
    }
    async getItemByID(idItem) {
        let criterio = { _id: ObjectId(idItem) };
        let item = await this.items.find(criterio).toArray();
        if(!item.toString()){//to check if no doc was found
            return null;
        }
        return (this.parseData(item[0]))
    }
    async getAllItems(){
        let items = await this.items.find({}).toArray();
        if(!items.toString()){//to check if no doc was found
            return null;
        }
        let itemList = []
        items.forEach(item => {
            itemList.push(this.parseData(item))
        });
        return itemList
    }
    async getItemByCriteria(criteria) {
        let item = await this.items.find(criteria).toArray();
        if(item instanceof Array && item.length !== 0) return (this.parseMultipleData(item))
        if(!item.toString()){//to check if no doc was found
            return null;
        }
        return (this.parseData(item))
    }
    async modifyByID(idItem, newItemParam){
        delete newItemParam.id;
        let query = await this.items.updateOne({ _id: ObjectId(idItem) }, { $set: newItemParam });
        return (query.modifiedCount > 0);
    }
    async deleteByID(idItem){
        let criterio = { _id: ObjectId(idItem) };
        let query = await this.items.deleteOne(criterio);
        return (query.deletedCount > 0);
    }
    parseData(item){//parse _id to id in order to manage the same property 
        let data = {
            id: item._id.toString(), ...item
        }
        delete data._id;
        return data
    }
    parseMultipleData(items){
        return items.map((item) => this.parseData(item))
    }
}
