const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productsSchema = new Schema({
    /* id:{
        type: Number,
        required: true
    }, */
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

productsSchema.plugin(mongoosePaginate)

exports.productModel = model('products', productsSchema)