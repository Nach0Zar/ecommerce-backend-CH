import { Error } from "../error/error.js";
import config from "../config/config.js";
import jwt from 'jsonwebtoken';
import mailer from '../utils/mailer.js';
import passport from 'passport';
import User from "../models/user.js";
import { Strategy as LocalStrategy } from 'passport-local';
import userRepository from "../repositories/userRepository.js";
import cartService from "./cartService.js";
import userDataValidation from "../validations/userDataValidation.js";

let instance = null;

class UserService{
    constructor(){
        this.container = userRepository;
        passport.use('local-login', new LocalStrategy(
            {
                usernameField: 'email'
            },
            (username, password, done) => {
                this.container.getItemByCriteria({email: username}).then((user)=>{
                    if(user){
                        const originalPassword = jwt.verify(user.getPassword(), config.SESSION.secret)
                        if (password !== originalPassword) {
                            return done(null, false)
                        }
                        done(null, user)
                    }
                    else{
                        return done(null, false)
                    }
                })
            })
        )
    }
    serializeUserMongo = (user, done) => {
        done(null, user.getID());
    }
    deserializeUserMongo = async (id, done) => {
        const user = await this.container.getItemByID(id)
        done(null, user.toDTO())
    }
    registerUser = async (information) => {
        userDataValidation(information);
        let cartID = await cartService.createCart();
        let user = new User({
            name: information.name,
            lastname: information.lastname,
            email: information.email,
            image: information.image,
            password: jwt.sign(information.password, config.SESSION.secret),
            cart: cartID
        })
        return this.container.save(user).then((userID)=>{
            mailer.send({
                to: config.MAIL_ADMIN,
                subject: 'nuevo registro!',
                text: `nuevo registro: ${JSON.stringify(user.toDTO())}`
            })
            return userID;
        }).catch((error)=>{            
            throw new Error(error, 'INTERNAL_ERROR')
        });
    }
    loginUser = async (email) => {
        let user = await this.container.getItemByCriteria({email: email})
        if(!user){
            throw new Error(`The server could not validate the credentials`, 'FORBIDDEN')
        }
        return user.getEmail();
    }
    getUserInformation = async (email) => {
        let user = await this.container.getItemByCriteria({email: email})
        if(!user){
            throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
        }            
        return user.toDTO();
    }
    getUserCartInformation = async (email) => {
        let user = await this.getUserInformation(email)
        let cartInformation = await cartService.getCartProducts(user.getCart());
        return cartInformation.toDTO();
    }
    checkExistingUser = async (email) => {
        let userFound = await this.container.getItemByCriteria({email: email});
        return (userFound !== null && userFound.length !== 0)
    }
    static getInstance(){
        if(!instance){
            instance = new UserService();
        }
        return instance;
    }
}
export default UserService.getInstance();