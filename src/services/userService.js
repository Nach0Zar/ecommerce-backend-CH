import { Error } from "../error/error.js";
import config from "../config/config.js";
import jwt from 'jsonwebtoken';
import mailer from '../utils/mailer.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userRepository from "../repositories/userRepository.js";
import cartService from "./cartService.js";
//TODO CREATE REPOSITORY + RETURN DTOs
let instance = null;

class UserService{
    constructor(){
        this.container = userRepository
        passport.use('local-login', new LocalStrategy(
            {},
            (username, password, done) => {
                this.container.getItemByCriteria({email: username}).then((user)=>{
                    if(user){
                        const originalPassword = jwt.verify(user.password, config.SESSION.secret)
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
        done(null, user.id);
    }
    deserializeUserMongo = (id, done) => {
        const user = this.container.getItemByID(id)
        done(null, user)
    }
    registerUser = async (information) => {
        let cartID = await cartService.createCart();
        let user = new User({
            name: information.name,
            lastname: information.lastname,
            email: information.username,
            image: information.image,
            password: jwt.sign(information.password1, config.SESSION.secret),
            cart: cartID
        })
        return this.container.save(user).then((userID)=>{
            mailer.send({
                to: config.MAIL_ADMIN,
                subject: 'nuevo registro!',
                text: `nuevo registro: ${JSON.stringify(user)}`
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
        return user;
    }
    getUserCartInformation = async (email) => {
        let user = await this.getUserInformation(email)
        let cartInformation = await cartService.getCartProducts(user.cart);
        return cartInformation;
    }
    checkExistingUser = async (email) => {
        let userFound = await this.container.getItemByCriteria({email: email});
        return (userFound !== null)
    }
    static getInstance(){
        if(!instance){
            instance = new UserService();
        }
        return instance;
    }
}
export default UserService.getInstance();