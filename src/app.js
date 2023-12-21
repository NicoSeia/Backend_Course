const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const { Server } = require('socket.io')
const { connectDb } = require('./config/config.js')

const productRouter = require('./routes/products.router.js')
const cartRouter = require('./routes/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const ProductManager = require('./daos/fileSystem/productManager.js')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'))

/* The code `app.engine('handlebars', handlebars.engine())` sets the template engine for the
application to Handlebars. It tells Express to use Handlebars as the view engine. */
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)

const serverHttp = app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});

//connection to data base
connectDb()

/* The code block is setting up a WebSocket server using Socket.IO. */
const io = new Server(serverHttp)

const { messageModel } = require('../src/daos/mongo/models/message.model.js')
//const products = new ProductManager('./src/mockDB/products.json')
const { productModel } = require('../src/daos/mongo/models/product.model.js')
io.on('connection', socket => {
  console.log('New client connection')

  socket.on('newProduct', async addProduct => {
    /* await products.addProduct(addProduct)
    const productsList = await products.getProducts() */
    const newProduct = new productModel(addProduct)
    await newProduct.save()

    const productsList = await productModel.find()

    socket.emit('products', productsList)
  })

  socket.on('deleteProduct', async deleteProductById => {
    /* await products.deleteProduct(deleteProductById)
    const productsList = await products.getProducts() */
    await productModel.findByIdAndDelete(deleteProductById)
    
    const productsList = await productModel.find()

    socket.emit('products', productsList)
  })

  socket.on('message', async (data) => {
    console.log(`${data.user}: ${data.message}`)

    try {
      const newMessage = {
        message: data.message,
        timestamp: new Date()
      }
  
      let userDocument = await messageModel.findOne({ user: data.user })
  
      if (!userDocument) {
        userDocument = new messageModel({
          user: data.user,
          messages: [newMessage]
        })
      } else {
        userDocument.messages.push(newMessage)
      }
  
      await userDocument.save()
  
      io.emit('messageLogs', { user: data.user, message: newMessage })
    } catch (error) {
      console.error('Error saving message to database:', error)
    }
  })
})



module.exports = app;