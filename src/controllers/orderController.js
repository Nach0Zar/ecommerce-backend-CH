//TODO IMPLEMENTAR
import cartService from '../services/cartService.js';
import logger from '../utils/logger.js';

let instance = null;

class OrderController{
    controllerGetUserOrders = async (req, res, next) => {
        try{
            logger.info(`GET REQUEST successful for getting all orders from user ${req.cookies.email}`);
            res.status(200).json();
        }
        catch(error){
            next(error);
        }
    }
    controllerPostPurchaseCart = async (req, res, next) => {
        try{
            logger.info(`POST REQUEST successful for product ${req.body.productId} in cart from user${req.cookies.email}`);
            res.status(200).json();
        }
        catch(error){
            next(error);
        }
    }
    static getInstance(){
        if(!instance){
            instance = new OrderController();
        }
        return instance;
    }
}
export default OrderController.getInstance();