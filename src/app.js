const express = require('express')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const cors = require('cors')
const { connectDb } = require('./config/config.js')
const passport = require('passport')
const { initializePassport } = require('./passport-jwt/passport.config.js')
const appRouter = require('./routes/general.router.js')
const cookie = require('cookie-parser')
const configureSocketIO = require('./helpers/socketIO.js')
const handlebars = require('express-handlebars')
const { logger, addLogger } = require('./utils/logger.js')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const handlebarsHelpers = require('handlebars-helpers')()
const eq = handlebarsHelpers.eq

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))
app.use(cookie())
app.use(cors())
app.use(session({
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_URI, 
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ttl: 15000000000,
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(addLogger)
app.use(appRouter)

/* app.use(session({
  secret: 'secret'
})) */

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Ecommerce Documentation',
      description: 'Api Doc for Ecommerce'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


initializePassport()
app.use(passport.initialize())
//app.use(passport.session())

/* The code `app.engine('handlebars', handlebars.engine())` sets the template engine for the
application to Handlebars. It tells Express to use Handlebars as the view engine. */
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: {
    eq: eq
  }
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

//connection to data base
connectDb()

const serverHttp = app.listen(PORT, () => {
  logger.info(`Example app listening on port ${PORT}`)
})

const io = configureSocketIO(serverHttp)

module.exports = { app, io }