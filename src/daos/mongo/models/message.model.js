const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
})

exports.messageModel = model('message', messageSchema)