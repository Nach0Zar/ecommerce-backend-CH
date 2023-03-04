import { createTransport } from 'nodemailer';
import config from '../../config/config.js';

class mailerClass {
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

export const mailer = new mailerClass(config.NODEMAILER_CONFIG)

