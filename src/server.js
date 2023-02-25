import express from 'express';
import bodyParser from 'body-parser';
import routerAPI from "./routers/router.js";
import userController from './controllers/userController.js';
import passport from 'passport';
const app = express();
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.use(passport.session());
app.use(passport.initialize());
passport.serializeUser((user, done) => {
    userController.serializeUserMongo(user, done)
});
passport.deserializeUser((id, done) => {
    userController.deserializeUserMongo(id, done);
});
//routes
app.use('/api/',routerAPI);
//server port listener
const port = process.env.PORT ?? 8080;
const server = app.listen(port,()=>{
    console.log(`Successfully connected to port ${server.address().port}`)
});
server.on("error", err => console.log(err));