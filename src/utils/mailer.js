import { createTransport } from 'nodemailer';
import config from '../config/config.js';

let instance = null;

class MailerClass {
    constructor() {
        this.nodemailerClient = createTransport(config.NODEMAILER_CONFIG)
    }
    async send(mailOptions) {
        try {
            return await this.nodemailerClient.sendMail(mailOptions)
        } catch (error) {
            throw new Error(error.message)
        }
    }
    static getInstance(){
        if(!instance){
            instance = new MailerClass();
        }
        return instance;
    }
}
export default MailerClass.getInstance();

