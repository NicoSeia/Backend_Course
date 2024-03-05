const { logger } = require("../../utils/logger");
const { cartModel } = require("./models/cart.model")

class cartDaoMongo {
    constructor(){
        this.model = cartModel
    }

    async create() {
        const newCart = new this.model({
            products: [],
        });

        await newCart.save()

        return newCart.toObject()
    }

    async get() {
        const carts = await this.model.find()
        return carts
    }

    async getById(cid) {
        const cart = await this.model.findOne({ _id: cid }).lean()

        if (cart) {
            return cart.products
        } else {
            logger.error("This cart does not exist")
            return { cart: { products: [] } }
        }
    }

    async add(cartId, productId) {
        let cart = await this.model.findOne({ _id: cartId })
            
        if (!cart) {
            const newCart = await this.model.create({
               products: [],
            })
            cart = newCart
        }

        const existingProductIndex = cart.products.findIndex((item) => item.product.equals(productId))

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({
            product: productId,
            quantity: 1,
            })
        }

        await cart.save()

        logger.info("Product added to cart successfully")
        return {
            success: true,
            message: 'Product added to cart successfully',
        }
    }

    async remove(cartId, productId) {
        const cart = await this.model.findOne({ _id: cartId })
        
        if (!cart) {
            return { success: false }
        }
        
        cart.products = cart.products.filter(
            (product) => product.product.toString() !== productId
        )
        
        await cart.save()
        
        return { success: true }
        
    }

    async update(cartId, newProduct) {
        const cart = await this.model.findOne({ _id: cartId })

        if(!cart){
            return { success: false}
        }

        cart.products = newProduct

        await cart.save()

        return { success: true }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        const cart = await this.model.findOne({ _id: cartId })

        if (!cart) {
            return { success: false }
        }

        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        )

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = newQuantity

            await cart.save()

            return { success: true }
        } else {
            return { success: false }
        }
    }

    async deleteAll(cartId) {
        const cart = await this.model.findOne({ _id: cartId })

        if (!cart) {
            return { success: false, message: 'Cart not found' }
        }
    
        cart.products = []
    
        await cart.save()
    
        return { success: true, message: 'All products deleted from the cart' }
    }


}

module.exports = cartDaoMongo