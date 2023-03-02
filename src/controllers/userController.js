import userContainerDB from '../models/containers/usersContainer.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import { mailer } from '../models/classes/mailer.js'

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
    registerUser = (req, res) => {
        if(req.body.password1 && (req.body.password1 === req.body.password2)){
            const user = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.username,
                profileImage: "blank",
                password: jwt.sign(req.body.password1, config.SESSION.secret)
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