import express from 'express';
import bodyParser from 'body-parser';
import routerAPI from "./routers/API.js";
const app = express();
//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
//routes
app.use('/api/',routerAPI);
//server port listener
const port = process.env.PORT ?? 8080;
const server = app.listen(port,()=>{
    console.log(`Successfully connected to port ${server.address().port}`)
});
server.on("error", err => console.log(err));
