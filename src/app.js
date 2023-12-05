const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const { Server } = require('socket.io')

const productRouter = require('./routes/products.router.js')
const cartRouter = require('./routes/carts.router.js')
const viewsRouter = require('./routes/views.router.js')
const ProductManager = require('./managers/productManager.js')


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


const io = new Server(serverHttp)

const products = new ProductManager('./src/mockDB/products.json')
io.on('connection', socket => {
  console.log('New client connection')

  socket.on('newProduct', async addProduct => {
    await products.addProduct(addProduct)
    const productsList = await products.getProducts()

    socket.emit('products', productsList)
  })

  socket.on('deleteProduct', async deleteProductById => {
    await products.deleteProduct(deleteProductById)
    const productsList = await products.getProducts()

    socket.emit('products', productsList)
  })
})


module.exports = app;