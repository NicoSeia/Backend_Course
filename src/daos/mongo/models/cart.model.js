const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    products: [
        {
            product: {
                type: Number,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
})

exports.cartModel = model('cart', cartSchema)