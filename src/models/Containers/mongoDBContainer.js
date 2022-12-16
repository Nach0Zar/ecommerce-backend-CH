import { mongoDatabase } from '../db/mongoClient.js';

class MongoDBContainer extends container {

    constructor(dataType) {
        super(dataType);
        this.items = mongoDatabase.collection(dataType);
    }

    async save(object) {
        await this.items.insertOne(object)
    }

    async getItemByID() {
        return await this.items.find(criterio).toArray()
    }
}
export default MongoDBContainer;
