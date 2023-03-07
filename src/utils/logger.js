import pino from 'pino';

const streams = [
    {level: 'info', stream: process.stdout},
    {level: 'warn', stream: pino.destination(`warn.log`) },
    {level: 'error', stream: pino.destination(`error.log`) },

];
class Logger {
    constructor(){
        this.logger = pino({level: 'info'}, pino.multistream(streams))
    }
    info = (message) => {
        this.logger.info(message)
    }
    warn = (message) => {
        this.logger.warn(message)
    }
    error = (message) => {
        this.logger.error(message)
    }
}

const logger = new Logger();
Object.freeze(logger);
export default logger;
  