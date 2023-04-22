import { Error } from "../error/error.js";
import config from "../config/config.js";

export default function userIsAdmin (req, res, next) {
    if(!config.ADMIN_LIST.includes(req.cookies.email)){
        throw new Error('You need to be admin in order to perform this action', 'UNAUTHORIZED')
    }
    next();
}