const { Server } = require('socket.io')
const MessageController = require('../controllers/message.controller.js')
const ProdcutsController = require('../controllers/products.controller.js')


function configureSocketIO(serverHttp) {
/* The code block is setting up a WebSocket server using Socket.IO. */
    const io = new Server(serverHttp)
    const productsController = new ProdcutsController()
    const messageController = new MessageController()

    io.on('connection', socket => {
        console.log('New client connection')

        socket.on('newProduct', async addProduct => {
            await productsController.addProduct(addProduct)
            const productsList = await productsController.getProducts()
            socket.emit('products', productsList)
        })

        socket.on('deleteProduct', async deleteProductById => {
            await productsController.deleteProduct(deleteProductById)
            const productsList = await productsController.getProducts()
            console.log('Products sent:', productsList);
            socket.emit('products', productsList)
        })

        socket.on('message', async (data) => {
            console.log(`${data.user}: ${data.message}`)

            try {
                const newMessage = {
                    message: data.message,
                    timestamp: new Date()
                }

                await messageController.addMessageToUser(data.user, newMessage)

                io.emit('messageLogs', { user: data.user, message: newMessage })
            } catch (error) {
                console.error('Error saving message to database:', error)
            }
        })
    })
    return io
}
module.exports = configureSocketIO