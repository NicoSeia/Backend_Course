const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        required: true
    }
})

exports.userModel = model('users', userSchema)