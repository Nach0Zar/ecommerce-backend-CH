import config from '../config/config.js';
import userService from '../services/userService.js';
import registerUserValidation from '../validations/registerUserValidation.js';
import logger from '../utils/logger.js';

let instance = null;

class UserController{
    controllerPostRegisterUser = async (req, res, next) => {
        try{
            await registerUserValidation(req);
            let userID = await userService.registerUser(req.body);
            logger.info(`POST REQUEST successful for registering user ${userID}`);
            res.status(201).json(userID)
        }
        catch(error){
            next(error);
        }
    }
    controllerPostLogInUser = async (req, res, next) => {
        try{
            let userEmailValidated = await userService.loginUser(req.body.email);
            logger.info(`POST REQUEST successful for logging in user with email ${userEmailValidated}`);
            res.cookie('email', userEmailValidated, {maxAge: config.SESSION.EXPIRY_TIME});
            res.sendStatus(200);
        }
        catch(error){
            next(error);
        }
    }
    controllerPostLogOutUser = (req, res) => {
        res.clearCookie('email');
        logger.info(`POST REQUEST successful for logging out user`);
        res.sendStatus(200);
    }
    controllerGetUserInformation = async (req, res, next) => {
        try{
            let userInformation = await userService.getUserInformation(req.cookies.email);
            logger.info(`GET REQUEST successful for getting the information of user ${req.cookies.email}`);
            res.status(200).json(userInformation);
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new UserController();
        }
        return instance;
    }
}
export default UserController.getInstance();