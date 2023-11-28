const { Router } = require('express')
const cartManager = require('../managers/cartManager')
const CartManager = require('../managers/cartManager')

const router = Router()
const cartService = new cartManager()

router
    .get('/', async (req,res)=>{
        try{
            const allCarts = await cartService.getCarts()
            res.json({
                status: 'success',
                payload: allCarts
            })
        }catch(error){
            console.log(error)
            res.status(500).send('Server error')
        }
    })
    .post('/', async (req,res)=>{
        try{
            const newCart = await cartService.createCart()
            res.json({
                status: 'success',
                payload: newCart
            })
        }catch(error){
            console.log(error)
            res.status(500).send('Server error')
        }
    })
    .get('/:cid', async (req,res)=> {
        try{
            const cid = req.params.cid
            const filteredCart = await cartService.getCartById(cid)
            if(filteredCart){
                res.json({
                    status: 'success',
                    payload: filteredCart
                })
            }
            else{
                res.status(404).send("Product not exist");
            }
        }catch(error){
            console.log(error)
            res.status(500).send('Server error')
        }
    })
    .post('/:cid/product/:pid', async (req,res)=>{
        try{
            const { cid, pid} = req.params
            const cartId = parseInt(cid)
            const productId = parseInt(pid)
            const productInCart = await cartService.addProductToCart(cartId, productId)
            res.json({
                status: 'success',
                payload: productInCart
            })
            
        }catch(error){
            console.log(error)
            res.status(500).send('Server error')
        }
    })



module.exports = router
