import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import routerAPI from "./routers/router.js";
import userController from './controllers/userController.js';
import passport from 'passport';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
const app = express();
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(session(config.SESSION));
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
//not implemented 
app.all('*', (req, res) => {
    res.status(404).json({error:-2, mensaje: "Ruta no implementada"})
})
//server port listener
const port = process.env.PORT ?? 8080;
const server = app.listen(port,()=>{
    console.log(`Successfully connected to port ${server.address().port}`)
});
server.on("error", err => console.log(err));