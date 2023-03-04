import userContainerDB from '../models/containers/usersContainer.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import { mailer } from '../models/models/mailer.js';
import cartController from './cartController.js';
import request from 'request';

class userControllerClass{
    constructor(userContainer){
        this.userContainer = userContainer;
    }
    serializeUserMongo = (user, done) => {
        done(null, user.id);
    }
    deserializeUserMongo = (id, done) => {
        const user = this.userContainer.getItemByID(id)
        done(null, user)
    }
    registerUser = async (req, res) => {
        if(req.body.password1 && (req.body.password1 === req.body.password2)){
            cartController.createCart().then((cartID)=>{
                const user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.username,
                    profileImage: "blank",
                    password: jwt.sign(req.body.password1, config.SESSION.secret),
                    cart: cartID
                }
                this.userContainer.getItemByEmail(user.email).then((userFound)=>{
                    if(userFound === null){
                        this.userContainer.save(user).then(()=>{
                            mailer.send({
                                to: config.MAIL_ADMIN,
                                subject: 'nuevo registro!',
                                text: `nuevo registro: ${JSON.stringify(user)}`
                            })
                            res.sendStatus(201)
                        })
                    }
                    else{
                        res.sendStatus(409)
                    }
                })
            }).catch((err)=>{
                console.log(err)
                res.sendStatus(500)
            })
            // request.post(`http://localhost:${config.PORT}/api/shoppingcart`, (err, response, body) => {
            //     if (err) { 
            //         res.sendStatus(500)
            //     }
            //     else{
            //         let cartID = JSON.parse(response.body).id
            //         const user = {
            //             firstname: req.body.firstname,
            //             lastname: req.body.lastname,
            //             email: req.body.username,
            //             profileImage: "blank",
            //             password: jwt.sign(req.body.password1, config.SESSION.secret),
            //             cart: cartID
            //         }
            //         this.userContainer.getItemByEmail(user.email).then((userFound)=>{
            //             if(userFound === null){
            //                 this.userContainer.save(user).then(()=>{
            //                     mailer.send({
            //                         to: config.MAIL_ADMIN,
            //                         subject: 'nuevo registro!',
            //                         text: `nuevo registro: ${JSON.stringify(user)}`
            //                     })
            //                     res.sendStatus(201)
            //                 })
            //             }
            //             else{
            //                 res.sendStatus(409)
            //             }
            //         })
            //     }
            // });
        }
        else{
            res.sendStatus(500)
        }
    }
    loginUser = (req, res) => {
        this.userContainer.getItemByEmail(req.body.username).then((item)=>{
            if(item){
                res.cookie('email', item.email, {maxAge: config.SESSION.EXPIRY_TIME})
                res.sendStatus(200)
            }
            else{
                res.sendStatus(403)
            }
        })
    }
    logoutUser = (req, res) => {
        res.clearCookie('email');
        res.sendStatus(200);
    }
    controllerGetUserInformation = (req, res) => {
        this.userContainer.getItemByEmail(req.cookies.email).then((item)=>{
            if(item){
                res.json(item)
                res.status(200)
            }
            else{
                res.sendStatus(403)
            }
        })
    }
    controllerGetUserCartInformation = (req, res) => {
        this.userContainer.getItemByEmail(req.cookies.email).then((item)=>{
            if(item){
                request.get(`http://localhost:${config.PORT}/api/shoppingcart/${item.cart}/products`, (err, response, body) => {
                    if (err) { 
                        res.sendStatus(500)
                    }
                    else{
                        res.json(JSON.parse(body))
                        res.status(200)
                    }
                });
            }
            else{
                res.sendStatus(403)
            }
        })
    }
}

const userController = new userControllerClass(new userContainerDB())
Object.freeze(userController);
passport.use('local-login', new LocalStrategy(
    {},
    (username, password, done) => {
        userController.userContainer.getItemByEmail(username).then((user)=>{
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
export default userController;