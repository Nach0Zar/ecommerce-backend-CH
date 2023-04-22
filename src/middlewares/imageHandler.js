import multer from "multer"
import { Error } from "../error/error.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/temp/images');
    },
    filename: function (req, file, cb) {
        let extension = file.originalname.split('.').pop();
        let allowedExtensions = ['gif', 'png', 'jpg', 'jpeg'];
        if(!allowedExtensions.includes(extension)){
            cb(new Error('Image extension not allowed','BAD_REQUEST'))
        }
        else{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+'.' + extension;
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    }
})
const upload = multer({ storage: storage })
export function postImage(file){
    return upload.single(file);
}
