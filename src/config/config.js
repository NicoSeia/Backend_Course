const dotenv = require('dotenv')
const { connect } = require('mongoose')
const { program } = require('./commander')
const { logger } = require('../utils/logger')


const { mode } = program.opts()
//logger.info('mode config: ', mode)

dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development' 
})

const configObject = {
    PORT: process.env.PORT || 4000,
    mongo_uri: process.env.MONGO_URI,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    persistence: process.env.PERSISTENCE,
    gmail_user_app: process.env.GMAIL_USER_APP,
    gmail_password_app: process.env.GMAIL_PASSWORD_APP
}

const connectDb = async () => {
    try {
        /* await connect(process.env.MONGO_URI) */
        MongoSingleton.getInstance()
        logger.info("Db connected")
    } catch(err) {
        logger.error(err)
    }
}


class MongoSingleton {
    static instance 
    constructor() {
      connect(process.env.MONGO_URI)
    }
  
    static getInstance() {
      if(!this.instance){
        logger.info('Connecting to data base')
        return this.instance = new MongoSingleton()
      }
      logger.info('Data base already connected')
      return this.instance
    }
  }

module.exports = {
    configObject,
    connectDb,
}