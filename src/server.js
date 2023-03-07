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
import cluster from 'cluster';
import Server from './utils/server.js';

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
//server configuration
if (config.MODE === 'cluster') {
    if (cluster.isPrimary) {
        logger.info('Execution mode: CLUSTER')
        logger.info(`Primary processs: pid ${process.pid}`)
        for (let i = 0; i < config.CPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', () => {
            cluster.fork();
        })
    } else {
        logger.info(`Secondary process: pid ${process.pid}`)
        const server = new Server(app)
        server.conectar({ puerto: config.PORT })
    }
} else {
    const server = new Server(app)
    server.conectar({ puerto: config.PORT })
    logger.info(`Successfully connected to port ${config.PORT}`)
}
app.on("error", err => logger.error(`${err}`));
//node ./src/server.js -p=8080 -m=cluster