import { Error } from "../error/error.js";

export default function checkUserLogged(req, res, next) {
    if(!req.cookies.email){
        throw new Error('You need to be logged in to perform this action', 'FORBIDDEN')
    }
    next();
}