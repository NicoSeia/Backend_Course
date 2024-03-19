/**
 * The function `isAdmin` checks if the user in the session has an 'admin' role and allows access or
 * sends a 403 status code if not.
 */
function isAdminOrPremium(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin' || req.session.user && req.session.user.role === 'premium') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

/**
 * The function `isUser` checks if the user in the session has the role of 'user' and allows access or
 * sends a 403 status code if not.
 */
function isUser(req, res, next) {
    if (req.session.user && req.session.user.role === 'user') {
        next()
    } else {
        res.status(403).send('Access forbidden')
    }
}

module.exports = {
    isAdminOrPremium,
    isUser,
}