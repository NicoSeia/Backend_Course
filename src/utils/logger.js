const winston = require('winston')

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        http: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        debug: 'white',
        http: 'green'
    }
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: process.env.PORT === 8080 ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const addLogger = (req, res, next) => {
    req.logger = logger
    next()
}

module.exports = {
    addLogger,
    logger
}