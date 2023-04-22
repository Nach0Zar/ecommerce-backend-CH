import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next){
    switch (err.type){
        case 'NOT_FOUND':{
            res.status(404);
            break;
        }
        case 'CONFLICT':{
            res.status(409);
            break;
        }
        case 'FORBIDDEN':{
            res.status(403);
            break;
        }
        case 'BAD_REQUEST':{
            res.status(400);
            break;
        }
        case 'UNAUTHORIZED':{
            res.status(401);
            break;
        }
        default: {
            res.status(500);
            break;
        }
    }
    logger.error(err.message)
    res.json({message: err.message})
}