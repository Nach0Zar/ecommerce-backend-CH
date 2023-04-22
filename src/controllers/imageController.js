import { Error } from '../error/error.js';
import logger from '../utils/logger.js';

let instance = null;

class ImageController{
    controllerPostImage = async (req, res, next) => {
        if(req instanceof Error){
            next(req);
        }
        try{
            const file = req.file
            logger.info(`POST REQUEST successful for image`);
            res.status(200).json({ path: file.path });
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new ImageController();
        }
        return instance;
    }
}
export default ImageController.getInstance();