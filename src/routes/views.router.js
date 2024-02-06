const { Router } = require('express')
const ViewsController = require('../controllers/views.controller')

const router = Router()

const {
    home,
    realTimeProducts,
    chat,
    products,
    productsDetails,
    login,
    register
} = new ViewsController()

router.get('/', home)

router.get('/realTimeProducts', realTimeProducts)

router.get('/chat', chat)

router.get('/products', products)

router.get('/products/details/:pid', productsDetails)

router.get('/login', login)

router.get('/register', register)

/* router.get('/logout', async (req,res) =>{
    res.render('login')
}) */


module.exports = router