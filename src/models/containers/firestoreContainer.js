import { firestoreDatabase } from '../../db/firestoreClient.js';
import Container from './container.js';
class FirestoreContainer extends Container{

    constructor(dataType) {
        super(dataType);
        this.items = firestoreDatabase.collection(nombreColeccion)
    }

    asObj(ref) {
        return { id: ref.id, ...ref.data() }
    }

    async save(object){
        const ref = await this.items.add(object)
        return { ...object, id: ref.id }
    }

    async getItemByID(criterio = {}) {
        const snapshot = await this.items.get()
        const result = []
        snapshot.forEach(doc => {
            result.push(asObj(doc))
        })
        return result
    }
}
export default FirestoreContainer;
