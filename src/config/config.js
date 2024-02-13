const dotenv = require('dotenv')
const { connect } = require('mongoose')
const { program } = require('./commander')

const { mode } = program.opts()
console.log('mode config: ', mode)

dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development' 
})

const configObject = {
    PORT: process.env.PORT || 4000,
    mongo_uri: process.env.MONGO_URI,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
}

const connectDb = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log("Db connected")
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    configObject,
    connectDb
}