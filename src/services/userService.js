import { Error } from "../error/error.js";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from "../config/config.js";
import jwt from 'jsonwebtoken';
import mailer from '../models/mailer.js';
import cartController from "../controllers/cartController.js";
import Service from "./service.js";
import cartService from "./cartService.js";

class UserService extends Service{
    constructor(){
        super("users")
        passport.use('local-login', new LocalStrategy(
            {},
            (username, password, done) => {
                userController.container.getItemByCriteria({email: username}).then((user)=>{
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
        let userFound = await this.container.getItemByCriteria({email: information.username})
        if(userFound != null){
            throw new Error(`There is already a user registered with the email ${information.username}`, 'CONFLICT');
        }
        if((information.password1 !== information.password2)){
            throw new Error(`The password did not match`, 'BAD_REQUEST');
        }
        if(!information.password1){
            throw new Error(`The password can not be empty`, 'BAD_REQUEST');
        }
        let cartID = await cartController.createCart();
        const user = {
            firstname: information.firstname,
            lastname: information.lastname,
            email: information.username,
            profileImage: "blank",
            password: jwt.sign(information.password1, config.SESSION.secret),
            cart: cartID
        }
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
    loginUser = (req, res) => {
        this.container.getItemByCriteria({email: req.body.username}).then((item)=>{
            if(item){
                res.cookie('email', item.email, {maxAge: config.SESSION.EXPIRY_TIME})
                res.sendStatus(200)
            }
            else{
                res.sendStatus(403)
            }
        })
    }
    getUserInformation = async (email) => {
        let user = await this.container.getItemByCriteria({email: email})
        if(!user){
            throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
        }            
        return user;
    }
    getUserCartInformation = async (email) => {
        let user = await this.getUserInformation({email: email})
        if(!user){
            throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
        }
        return cartService.getCartProducts(user.cart);
    }
}
const userService = new UserService();
Object.freeze(userService);
export default userService;