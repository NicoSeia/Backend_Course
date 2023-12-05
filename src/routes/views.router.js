const { Router } = require('express')

const router = Router()

const ProductManager = require("../managers/productManager");

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

module.exports = router