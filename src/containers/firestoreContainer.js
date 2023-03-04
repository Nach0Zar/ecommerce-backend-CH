import { firestoreDatabase } from '../../db/firestoreClient.js';
import Container from './container.js';
class FirestoreContainer extends Container{
    constructor(dataType) {
        super(dataType);
        this.items = firestoreDatabase.collection(dataType)
    }
    asObj(ref) {
        return { id: ref.id, ...ref.data() }
    }
    async save(object){
        const ref = await this.items.add(object.toDTO())
        return ref.id 
    }
    async getItemByID(idItem){
        const ref = this.items.doc(idItem)
        let doc = await ref.get()
        if(!doc.data()){//to check if no item was found matching ID
            return null;
        }
        return this.asObj(doc);
    }
    async getAllItems() {
        const snapshot = await this.items.get()
        const result = []
        snapshot.forEach(doc => {
            result.push(this.asObj(doc))
        })
        return result
    }
    async modifyByID(idItem, newItemParam){
        const doc = this.items.doc(idItem);
        let item = await doc.update(newItemParam);
        const ref = await doc.get()
        return (item.writeTime !== null);
    }
    async deleteByID(idItem){
        const doc = this.items.doc(idItem);
        const item = await doc.delete();
        return (await this.getItemByID(idItem) === null);
    }
}
export default FirestoreContainer;
