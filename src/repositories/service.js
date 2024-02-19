const { ProductDao, UserDao, CartDao, MessageDao } = require('../daos/factory')
const ProductRepository = require('./product.repository')
const UserRepository = require('./user.repository')
const CartRepository = require('./cart.repository')
const MessageRepository = require('./message.repository')

const productService = new ProductRepository(new ProductDao)
const userService = new UserRepository(new UserDao)
const cartService = new CartRepository(new CartDao)
const messageService = new MessageRepository(new MessageDao)

module.exports = {
    productService,
    userService,
    cartService,
    messageService,
}