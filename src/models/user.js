import { randomUUID } from 'crypto';
class User{
    id
    email
    password
    name
    lastname
    image
    cart
    constructor(email, password, name, lastname, image, cart, id = randomUUID()){
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastname = lastname;
        this.image = image;
        this.cart = cart;
        this.id = id;
    }
    toDTO(){
        const dto = {
            email: this.email,
            password: this.password,
            name: this.name,
            lastname: this.lastname,
            image: this.image,
            id: this.id,
            cart: this.cart,
        }
        return dto
    }
}
export default User;