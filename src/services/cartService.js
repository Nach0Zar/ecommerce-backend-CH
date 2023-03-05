import { Error } from "../error/error.js";
import Service from "./service.js";

class CartService extends Service{
    #container
    constructor(){
        super("carts")
    }
    getCartProducts = (email) => {

    }
}
const cartService = new CartService();
Object.freeze(cartService);
export default cartService;