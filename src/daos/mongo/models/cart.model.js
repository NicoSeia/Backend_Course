const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
})

/* cartSchema.pre('findOne', function(){
    this.populate('products.product')
})
 */
exports.cartModel = model('cart', cartSchema)