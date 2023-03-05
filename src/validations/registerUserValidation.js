import { Error } from "../error/error.js";
import userService from "../services/userService.js";

export default async function registerUserValidation (req) {
    if((req.body.password1 !== req.body.password2)){
        throw new Error(`The password do not match`, 'BAD_REQUEST');
    }
    if(!req.body.password1){
        throw new Error(`The password can not be empty`, 'BAD_REQUEST');
    }
    let userFound = await userService.checkExistingUser(req.body.username)
    if(userFound){
        throw new Error(`There is already a user registered with the email ${req.body.username}`, 'CONFLICT');
    }
}