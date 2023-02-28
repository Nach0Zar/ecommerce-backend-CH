import dotenv from 'dotenv';
import { cpus } from 'os';
import parseArgs from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:path.join(__dirname+'/../.env')});
const argv = parseArgs(process.argv.slice(2), { alias: { p: 'port', m: 'mode', e: 'env' }, default: { port: 8080, mode: 'fork', env: 'development'} })
const EXPIRY_TIME = 10000//60 * 10 * 1000
const sessionConfig = {
    //mongo sessions
    // store: MongoStore.create({
    //     mongoUrl: `process.env.MONGODB_CNXSTRING`,
    //     ttl: 60 * 10
    // }),
    cookie: {
        httpOnly: false,
        secure: false,
        expires: EXPIRY_TIME
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    EXPIRY_TIME: EXPIRY_TIME
}
const config = {
    PORT: argv.port,
    MODE: argv.mode,
    CPUs: cpus().length,
    ARGS: process.argv,
    OS: process.env.OS,
    NODE_VERSION: process.versions.node,
    PATH: process.cwd(),
    RSS: process.memoryUsage().rss,
    SESSION: sessionConfig,
    PROCESS_ID: process.pid,
    PROJECT_FOLDER: process.INIT_CWD,
    mongoRemote: {
        client: 'mongodb',
        dbName: process.env.MONGODB_DBNAME,
        cnxStr: process.env.MONGODB_CNXSTRING,
        SECRETSTR: process.env.MONGODB_SECRETSTR
    },
    mysql: {
        client: 'mysql2',
        connection: process.env.MYSQL
    }
}
export default config;
