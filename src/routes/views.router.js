const { Router } = require('express')

const router = Router()

const ProductManager = require("../daos/fileSystem/productManager");

const productDaoMongo = require('../daos/mongo/productDaoMongo')
const productViewService = new productDaoMongo()

router.get('/', async (req, res) => {
    const products = await productViewService.getProducts()
    console.log(products)
    res.render('home', {
        title: 'Home',
        products
    })
})

router.get('/realTimeProducts', async (req, res) => {
    const products = await productViewService.getProducts()
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