import { Error } from "../error/error.js";

export default async function userIsAdmin (req) {
    if(!req.cookies.email){
        throw new Error('You need to be admin in order to perform this action', 'UNAUTHORIZED')
    }
    next();
}