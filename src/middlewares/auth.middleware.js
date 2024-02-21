const passport = require('passport')
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