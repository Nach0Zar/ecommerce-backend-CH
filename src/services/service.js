import { PERSISTENCIA } from '../db/config/config.js';
import FirestoreContainer from '../containers/firestoreContainer.js';
import MongoDBContainer from '../containers/mongoDBContainer.js';
import MemoryFSContainer from '../containers/MemoryFSContainer.js';

export default class Service {
    constructor(dataType){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.container = new MongoDBContainer(dataType)
                break
            case 'firebase':
                this.container = new FirestoreContainer(dataType)
                break
            default:
                this.container = new MemoryFSContainer(dataType)
                break
        }
    }
}