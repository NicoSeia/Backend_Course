const { Router } = require('express')

const router = Router()

const ProductManager = require("../daos/fileSystem/productManager");

const productDaoMongo = require('../daos/mongo/productDaoMongo');
const { userModel } = require('../daos/mongo/models/user.model');
const productViewService = new productDaoMongo()

router.get('/', async (req, res) => {
    try{
        const { limit, pageNumber, sort, query } = req.query
        const parsedLimit = limit ? parseInt(limit, 10) : 10
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await userModel.findOne({ _id: userId }).lean()
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
        //console.log(docs)
        res.render('home', {
            title: 'Home',
            user,
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
        const { limit, pageNumber, sort, query } = req.query
        const parsedLimit = limit ? parseInt(limit, 10) : 10
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await userModel.findOne({ _id: userId }).lean()
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
        //console.log(docs)
        res.render('realTimeProducts', {
            title: 'Real Time',
            user,
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

router.get('/chat', async (req,res) => {
    const userId = req.session && req.session.user ? req.session.user.user : null
    const user = await userModel.findOne({ _id: userId }).lean()
    try{
        res.render('chat', {
        title: "Chat",
        user,
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
        const userId = req.session && req.session.user ? req.session.user.user : null
        const user = await userModel.findOne({ _id: userId }).lean()
        //console.log('User data:', user)
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query })
        //console.log(docs)
        res.render('productsView', {
            title: 'Products View',
            user,
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

router.get('/login', async (req,res) =>{
    res.render('login')
})

router.get('/register', async (req,res) =>{
    res.render('register')
})

/* router.get('/logout', async (req,res) =>{
    res.render('login')
}) */


module.exports = router