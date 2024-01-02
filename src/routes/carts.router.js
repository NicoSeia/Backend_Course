const { Router } = require('express')
const mongoose = require('mongoose')
const cartManager = require('../daos/fileSystem/cartManager')
const cartDaoMongo = require('../daos/mongo/cartDaoMongo')

const router = Router()
const cartService = new cartDaoMongo()

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
            const cartId = mongoose.Types.ObjectId(cid)
            const productId = mongoose.Types.ObjectId(pid)
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
    .delete('/:cid/product/:pid', async (req,res) =>{
        try {
            const { cid, pid } = req.params
            const result = await cartService.removeProductFromCart(cid, pid)
      
            if (result.success) {
              res.json({
                status: 'success',
                message: 'Product removed from cart successfully',
              })
            } else {
              res.status(404).json({
                status: 'error',
                message: 'Product or cart not found',
              })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Server error')
        }
    })
    .put('/:cid', async (req, res) => {
        try {
            const { cid } = req.params
            const { products } = req.body
            const result = await cartService.updateCart(cid, products)
        
            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Cart updated successfully',
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Cart not found',
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Server error')
        }
    })
    .put('/:cid/products/:pid', async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
        
            const result = await cartService.updateProductQuantity(cid, pid, quantity)
        
            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Product quantity updated successfully',
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Cart or product not found',
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error')
        }
    })
    .delete('/:cid', async (req, res) => {
        try {
            const { cid } = req.params
            const result = await cartService.deleteAllProducts(cid)
        
            if (result.success) {
                return res.json({
                    status: 'success',
                    message: result.message,
                })
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: result.message,
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Server error')
        }
    })
    .post('/add/:pid', async (req, res) => {
        try {
            const { pid } = req.params

            const cartId = '659455545a9b96347f29314d'

            await cartService.addProductToCart(cartId, pid)

            res.json({
                status: 'success',
                message: 'Product added to cart successfully',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Server error',
            })
        }
    })



module.exports = router
