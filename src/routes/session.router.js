const { Router } = require('express')
const passport = require('passport')
const { passportCall } = require('../passport-jwt/passportCall.middleware')
const { authorization } = require('../passport-jwt/authorization.middleware')
const SessionController = require('../controllers/session.controller')
const { isAuthenticated } = require('../middlewares/auth.middleware')
const { upload, uploadFields } = require('../utils/multer')
const { isAdmin } = require('../middlewares/roleVerification')

const router = Router()

const {
    register,
    login,
    logout,
    current,
    github,
    githubCallback,
    toggleUserRole,
    user,
    uploadsMulter,
    uploadsMulterView,
    getAllUsers,
    deleteInactiveUsers
} = new SessionController()


router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

router.get('/current', [passportCall('jwt'), authorization(['ADMIN', 'PUBLIC'])], current)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), github)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubCallback)

router.get('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'Protected route' })
})

router.put('/premium/:uid', toggleUserRole)

router.post('/:uid/documents', uploadFields, uploadsMulter)

router.get('/:uid/upload-files', uploadsMulterView)

router.get('/', isAdmin , getAllUsers)

router.delete('/', isAdmin, deleteInactiveUsers)

router.get('/user/:uid', user)
module.exports = router