import User from '../models/user.js';
import MongoDBContainer from "../containers/mongoDBContainer.js";

let instance = null;

class UserRepository {
    #dao
    constructor() {
        this.#dao = new MongoDBContainer("users")
    }
    parseItems(usersDTOs){
        let parsedUsers = [];
        usersDTOs.foreach((user)=>{
            parsedUsers.push(new User(user))
        })
        return parsedUsers;
    }
    async save(user) {
        return await this.#dao.save(user.toDTO());
    }
    async getItemByID(id) {
        const dto = await this.#dao.getItemByID(id)
        if (!dto) return null
        return new User(dto)
    }
    async getAllItems(){
        let usersDTOs = this.#dao.getAllItems();
        return this.parseItems(usersDTOs);
    }
    async getItemByCriteria(criteria) {
        const dtos = await this.#dao.getItemByCriteria(criteria)
        if (!dtos) return null
        if (dtos.length === 1) {
            return new User(dtos);
        }
        else{
            return this.parseItems(dtos);
        }
    }
    async modifyByID(id, newUser){
        let updateInfo = {
            email: newUser.getEmail(),
            password: newUser.getPassword(),    
            name: newUser.getName(),    
            lastname: newUser.getLastname(),
            image: newUser.getImage(),
            cart: newUser.getCart()
        }
        return await this.#dao.modifyByID(id, updateInfo);
    }
    async deleteById(id){
        return this.#dao.deleteById(id)
    }
    static getInstance(){
        if(!instance){
            instance = new UserRepository();
        }
        return instance;
    }
}
export default UserRepository.getInstance();