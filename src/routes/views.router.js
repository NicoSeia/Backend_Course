const { Router } = require('express')
const ViewsController = require('../controllers/views.controller')
const { isAdminOrPremium, isUser } = require('../middlewares/roleVerification')
const { isAuthenticated } = require('../middlewares/auth.middleware')


const router = Router()

const {
    home,
    realTimeProducts,
    chat,
    products,
    productsDetails,
    login,
    register,
    shoppingCart,
    resetPasswordView,
    sendResetEmail,
    resetPassword
} = new ViewsController()

router.get('/', home)

router.get('/realTimeProducts', isAdminOrPremium, realTimeProducts)

router.get('/chat',isUser , chat)

router.get('/products', products)

router.get('/products/details/:pid', productsDetails)

router.get('/login', login)

router.get('/register', register)

router.get('/cart', isAuthenticated, shoppingCart)

router.get('/reset-password', resetPasswordView)

router.post('/reset-password', sendResetEmail)

router.get('/reset-password:token', resetPasswordView)

router.post('/reset-password:token', resetPassword)

/* router.get('/logout', async (req,res) =>{
    res.render('login')
}) */

module.exports = router