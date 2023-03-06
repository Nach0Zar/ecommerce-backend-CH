import { Error } from "../error/error.js";
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from "../config/config.js";
import jwt from 'jsonwebtoken';
import mailer from '../utils/mailer.js';
import Service from "./service.js";
import cartService from "./cartService.js";

class UserService extends Service{
    constructor(){
        super("users")
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
    loginUser = async (email) => {
        let item = await this.container.getItemByCriteria({email: email})
        if(!item){
            throw new Error(`The server could not validate the credentials`, 'FORBIDDEN')
        }
        return item.email;
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
    purchaseCart = async (email) => {
        if(!this.checkExistingUser(email)){
            throw new Error(`No user was found with the email ${email}`, 'NOT_FOUND');
        }
        let user = await this.container.getItemByCriteria({email: email})
        let productsBougth = await cartService.purchaseCart(user.cart);
        mailer.send({
            to: config.MAIL_ADMIN,
            subject: `nueva compra de: ${user.firstname} ${user.lastname} - ${email}`,
            text: `elementos comprados: ${(productsBougth.map((product)=>product.title)).join(", ")}`
        })
        return productsBougth.map((product)=>product.title);
    }
}
const userService = new UserService();
Object.freeze(userService);
export default userService;