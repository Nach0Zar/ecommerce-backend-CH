import userContainerDB from '../models/containers/usersContainer.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

class userControllerClass{
    constructor(userContainer){
        this.userContainer = userContainer;
    }
    serializeUserMongo = (user, done) => {
        done(null, user.id);
    }
    deserializeUserMongo = (id, done) => {
        const user = userContainer.then((container) => container.getItemByID(id))
        done(null, user)
    }
    registerUser = (req, res) => {
        if(req.body.password1 === req.body.password2){
            const user = {
                email: req.body.username,
                password: jwt.sign(req.body.password1, config.SESSION_SECRET)
            }
            userContainer.then((container)=>{
                container.getItemByEmail(user.email).then((userFound)=>{
                    if(userFound === null){
                        container.save(user).then(()=>{
                            res.status(201)
                        })
                    }
                    else{
                        res.status(500)
                    }
                })
            })
        }
        else{
            res.status(500)
        }
    }
    loginUser = (req, res) => {
        userContainer.then((container) => {
            container.getItemByEmail(req.body.username).then((item)=>{
                if(item){
                    res.cookie('email', item.email, {maxAge: 60 * 10 * 1000})
                    res.status(200)
                }
                else{
                    res.status(500)
                }
            })
        })

    }
}

const userController = new userControllerClass(new userContainerDB())
Object.freeze(userController);
passport.use('local-login', new LocalStrategy(
    {},
    (username, password, done) => {
        userContainer.then((container)=> {
            container.getItemByEmail(username).then((user)=>{
                const originalPassword = jwt.verify(user?.password, SESSION_SECRET)
                if (password !== originalPassword) {
                    return done(null, false)
                }
                done(null, user)
                })
            })
    })
)
export default userController;