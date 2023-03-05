import config from '../config/config.js';
import request from 'request';
import userService from '../services/userService.js';

class userControllerClass{
    controllerPostRegisterUser = async (req, res, next) => {
        try{
            let userID = await userService.registerUser(req.body);
            res.status(201).json(userID)
        }
        catch(error){
            next(error);
        }
    }
    controllerPostLogInUser = (req, res, next) => {
        try{
            userService.loginUser();
        }
        catch(error){
            next(error);
        }
    }
    controllerPostLogOutUser = (req, res) => {
        res.clearCookie('email');
        res.sendStatus(200);
    }
    controllerGetUserInformation = (req, res, next) => {
        try{
            let userInformation = userService.getUserInformation();
            res.status(200).json(userInformation);
        }
        catch(error){
            next(error)
        }
    }
    controllerGetUserCartInformation = (req, res) => {
        try{
            let cartInformation = userService.getUserCartInformation(email)
            res.status(200).json(cartInformation);
        }
        catch(error){
            next(error)
        }
    }
}

const userController = new userControllerClass()
Object.freeze(userController);
export default userController;