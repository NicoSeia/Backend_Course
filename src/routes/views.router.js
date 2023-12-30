const { Router } = require('express')

const router = Router()

const ProductManager = require("../daos/fileSystem/productManager");

const productDaoMongo = require('../daos/mongo/productDaoMongo')
const productViewService = new productDaoMongo()

router.get('/', async (req, res) => {
    try{
        const { limit, pageNumber, sort, query } = req.query
        const parsedLimit = limit ? parseInt(limit, 10) : 10
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
        //console.log(docs)
        res.render('home', {
            title: 'Home',
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        })
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Server error'})
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try{
        const products = await productViewService.getProducts()
        console.log(products)
        res.render('realTimeProducts', {
            title: 'Real Time',
            products
        })
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Server error'})
    }
})

router.get('/chat', async (req,res) => {
    try{
        res.render('chat', {
        title: "Chat"
        })
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Server error'})
    }
})

router.get('/products', async (req,res) =>{
    try{
        const { limit, pageNumber, sort, query } = req.query
        const parsedLimit = limit ? parseInt(limit, 10) : 10
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
        //console.log(docs)
        res.render('productsView', {
            title: 'Products View',
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        })
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Server error'})
    }
})

router.get('/products/details/:pid', async (req,res) =>{
    try{
        const pid = req.params.pid;
        const filteredProduct = await productViewService.getProductById(pid)
        if(filteredProduct){
            res.render('details', {
                title: 'Product Detail',
                filteredProduct
            })
        }
        else{
            res.status(404).send("Product not exist")
        }
    }catch(error){
        console.log(error)
        res.status(500).send('Server error')
    }
})



module.exports = router