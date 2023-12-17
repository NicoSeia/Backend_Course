const { connect } = require('mongoose')

exports.connectDb = async () => {
    connect('mongodb+srv://nicolasseia0:arCZpn6vklZ6nebR@cluster0.bmytq5v.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log("Db connected")
}
