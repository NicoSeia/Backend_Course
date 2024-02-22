const {Router} = require('express')

const productRouter = require('./products.router.js')
const cartRouter = require('./carts.router.js')
const viewsRouter = require('./views.router.js')
const sessionRouter = require('./session.router.js')
const mailRouter = require('./mail.router.js')

const router = Router()

router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/', viewsRouter)
router.use('/api/session', sessionRouter)
router.use('/api', mailRouter)

module.exports = router