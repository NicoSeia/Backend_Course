const { Router } = require('express')

const CartController = require('../controllers/carts.controller')

const router = Router()
const {
    getCarts,
    getCartById,
    createCart,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    deleteAllProducts
} = new CartController()

router
    .get('/', getCarts)
    .post('/', createCart)
    .get('/:cid', getCartById)
    .post('/:cid/product/:pid', addProductToCart)
    .delete('/:cid/product/:pid', removeProductFromCart)
    .put('/:cid', updateCart)
    .put('/:cid/products/:pid', updateProductQuantity)
    .delete('/:cid', deleteAllProducts)
    .post('/:pid', addProductToCart)



module.exports = router
