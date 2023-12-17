const { cartModel } = require("./models/cart.model");

class cartDaoMongo {
    constructor(){
        this.model = cartModel
    }

    async createCart() {
        const lastCart = await this.model.findOne({}, {}, { sort: { 'id': -1 } })

        const newCart = new this.model({
            id: lastCart ? lastCart.id + 1 : 1,
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
        const cart = await this.model.findOne({ id: parseInt(cid) })

        if (cart) {
            return { cart: cart.toObject() }
        } else {
            console.log("This cart does not exist")
            return { cart: { products: [] } }
        }
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.model.findOne({ id: parseInt(cartId) })

        if (!cart) {
            console.log("Cart not found")
            return
        }

        const existingProductIndex = cart.products.findIndex((item) => item.product === parseInt(productId))

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
    }

}

module.exports = cartDaoMongo