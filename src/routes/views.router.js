const { Router } = require('express')

const router = Router()

const ProductManager = require("../daos/fileSystem/productManager");

const productManager = new ProductManager("./src/mockDB/products.json")

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    console.log(products)
    res.render('home', {
        title: 'Home',
        products
    })
})

router.get('/realTimeProducts', async (req, res) => {
    const products = await productManager.getProducts()
    console.log(products)
    res.render('realTimeProducts', {
        title: 'Real Time',
        products
    })
})

router.get('/chat', async (req,res) => {
    res.render('chat', {
        title: "Chat"
    })
})

module.exports = router