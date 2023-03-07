import config from '../../config/config.js';

export const CNX_STR = config.mongoRemote.cnxStr //'mongodb+srv://nachocoderhouse:passwordpassword@cluster0.hmqkdpj.mongodb.net/coderhouse'

export const DB_NAME = config.mongoRemote.dbName
//persistencia en mongodb, firebase o memoria/fs
export const PERSISTENCIA = 'mongodb'