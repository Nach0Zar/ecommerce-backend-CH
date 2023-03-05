import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import routerAPI from "./routers/router.js";
import userService from './services/userService.js';
import passport from 'passport';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

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
    userService.serializeUserMongo(user, done)
});
passport.deserializeUser((id, done) => {
    userService.deserializeUserMongo(id, done);
});
//routes
app.use('/api/',routerAPI);
//not implemented 
app.all('*', (req, res) => {
    const {method, url} = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.status(404).json({error:-2, mensaje: "Ruta no implementada"})
})
//errorHandler
app.use(errorHandler)
//server port listener
const port = process.env.PORT ?? 8080;
const server = app.listen(port,()=>{
    console.log(`Successfully connected to port ${server.address().port}`)
});
server.on("error", err => logger.error(`${err}`));