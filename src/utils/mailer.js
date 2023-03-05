import { createTransport } from 'nodemailer';
import config from '../config/config.js';

class MailerClass {
    constructor(config) {
        this.nodemailerClient = createTransport(config)
    }

    async send(mailOptions) {
        try {
            return await this.nodemailerClient.sendMail(mailOptions)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
const mailer = new MailerClass(config.NODEMAILER_CONFIG);
Object.freeze(mailer);
export default mailer;

