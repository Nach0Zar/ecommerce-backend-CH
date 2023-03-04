import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import { mailer } from '../models/mailer.js';
import cartController from './cartController.js';
import request from 'request';
import { PERSISTENCIA } from '../db/config/config.js';
import FirestoreContainer from '../containers/firestoreContainer.js';
import MongoDBContainer from '../containers/mongoDBContainer.js';
import MemoryFSContainer from '../containers/MemoryFSContainer.js';

class userControllerClass{
    #container
    constructor(){
        switch (PERSISTENCIA) {
            case 'mongodb': 
                this.#container = new MongoDBContainer("users")
                break
            case 'firebase':
                this.#container = new FirestoreContainer("users")
                break
            default:
                this.#container = new MemoryFSContainer("users")
                break
        }
        passport.use('local-login', new LocalStrategy(
            {},
            (username, password, done) => {
                userController.#container.getItemByCriteria({email: username}).then((user)=>{
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
        const user = this.#container.getItemByID(id)
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
                this.#container.getItemByCriteria({email: user.email}).then((userFound)=>{
                    if(userFound === null){
                        this.#container.save(user).then(()=>{
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
        }
        else{
            res.sendStatus(500)
        }
    }
    loginUser = (req, res) => {
        this.#container.getItemByCriteria({email: req.body.username}).then((item)=>{
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
        this.#container.getItemByCriteria({email: req.cookies.email}).then((item)=>{
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
        this.#container.getItemByCriteria({email: req.cookies.email}).then((item)=>{
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

const userController = new userControllerClass()
Object.freeze(userController);
export default userController;