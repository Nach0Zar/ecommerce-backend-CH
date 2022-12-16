import { PERSISTENCIA } from '../../db/config/config.js';
import FirestoreContainer from '../Containers/firestoreContainer.js';
import MongoDBContainer from '../Containers/mongoDBContainer.js';
import MemoryFSContainer from '../Containers/memoryFSContainer.js';
class Model{
    constructor(dataType){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.container = new MongoDBContainer(dataType)
                break
            case 'firestore':
                this.container = new FirestoreContainer(dataType)
                break
            default:
                this.container = new MemoryFSContainer(dataType)
        }
    }
}
export default Model;