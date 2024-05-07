const passport = require('passport')
const jwt = require('jsonwebtoken')
const { jwt_secret_key } = require('../config/config')

const SECRET_KEY = jwt_secret_key
/**
 * The function `isAuthenticated` checks if a user is authenticated based on the session and returns an
 * unauthorized message if not.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
}

/* function isAuthenticated(req, res, next) {
    // Extraer el token del encabezado Authorization
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        // Eliminar el prefijo 'Bearer ' y obtener el token
        const token = authorizationHeader.substring(7);

        try {
            // Verificar el token usando la clave secreta
            const decodedToken = jwt.verify(token, SECRET_KEY);

            // Almacenar la información del usuario decodificado en req.user
            req.user = decodedToken;

            // Continuar con la siguiente función del middleware
            next();
        } catch (error) {
            // El token no es válido
            res.status(401).json({ message: 'Unauthorized gggg' });
        }
    } else {
        // No se proporciona un token en el encabezado Authorization
        res.status(401).json({ message: 'Unauthorizedhhhhhhh' });
    }
} */

function authenticateUser(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        req.user = user
        next()
    })(req, res, next)
}

module.exports = {
    isAuthenticated,
    authenticateUser
}