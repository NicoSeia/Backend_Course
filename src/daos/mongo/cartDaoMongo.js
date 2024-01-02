const { cartModel } = require("./models/cart.model");

class cartDaoMongo {
    constructor(){
        this.model = cartModel
    }

    async createCart() {
        const newCart = new this.model({
            products: [],
        });

        await newCart.save()

        return newCart.toObject()
    }

    async getCarts() {
        const carts = await this.model.find()
        return carts
    }

    async getCartById(cid) {
        const cart = await this.model.findOne({ _id: cid })

        if (cart) {
            return { cart: cart.toObject() }
        } else {
            console.log("This cart does not exist")
            return { cart: { products: [] } }
        }
    }

    async addProductToCart(cartId, productId) {
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

        console.log("Product added to cart successfully")
        return {
            success: true,
            message: 'Product added to cart successfully',
        }
    }

    async removeProductFromCart(cartId, productId) {
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

    async updateCart(cartId, newProduct) {
        const cart = await this.model.findOne({ _id: cartId })

        if(!cart){
            return { success: false}
        }

        cart.products = newProduct

        await cart.save()

        return { success: true }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
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

    async deleteAllProducts(cartId) {
        const cart = await this.model.findOne({ _id: cartId })

        if (!cart) {
            return { success: false, message: 'Cart not found' }
        }
    
        cart.products = [];
    
        await cart.save();
    
        return { success: true, message: 'All products deleted from the cart' }
    }


}

module.exports = cartDaoMongo