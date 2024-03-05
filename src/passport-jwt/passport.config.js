const passport = require('passport')
const passport_jwt = require('passport-jwt')
const { logger } = require('../utils/logger')

const JWTStrategy = passport_jwt.Strategy
const extract_jwt = passport_jwt.ExtractJwt

const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null
        /* console.log("request cookie initialize passport: ", req)
        console.log("request cookie initialize passport: ", req.cookies) */
        if (req && req.cookies) {
            token = req.cookies['token']
        }

        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: extract_jwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'palabrasecretaparaeltoken'
    }, async (jwt_payload, done)=>{
        try {
            logger.info('jwt_payload passport config: ', jwt_payload)
            return done(null, jwt_payload)            
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = {
    initializePassport
}