const mongoose = require('mongoose')
const { cartService, userService, productService } = require('../repositories/service')
const { ticketModel } = require('../daos/mongo/models/ticket.model')
const customError = require('../services/errors/customError')
const { generateCartErrorInfo, generateCartRemoveErrorInfo } = require('../services/errors/generateErrorInfo')
const { EErrors } = require('../services/errors/enum')
const { logger } = require('../utils/logger')

class CartController {
    constructor(){
        this.cartService = cartService
        this.userService = userService
        this.productService = productService
        this.ticketModel = ticketModel
    }

    getCarts = async (req,res)=>{
        try{
            const allCarts = await this.cartService.getCarts()
            res.json({
                status: 'success',
                payload: allCarts
            })
        }catch(error){
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    createCart = async (req,res)=>{
        try{
            const newCart = await this.cartService.createCart()
            res.json({
                status: 'success',
                payload: newCart
            })
        }catch(error){
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    getCartById = async (req,res)=> {
        try{
            const cid = req.params.cid
            const filteredCart = await this.cartService.getCartById(cid)
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
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    addProductToCart = async (req,res)=>{
        try{
            const { cid, pid} = req.params
            const cartId = new mongoose.Types.ObjectId(cid)
            const productId = new mongoose.Types.ObjectId(pid)
            const productInCart = await this.cartService.addProductToCart(cartId, productId)
            res.json({
                status: 'success',
                payload: productInCart
            })
            
        }catch(error){
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    removeProductFromCart = async (req,res,next) =>{
        try {
            const { cid, pid } = req.params
            if(!cid || !pid){
                customError.createError({
                    name: 'Error to remove product from cart',
                    cause: generateCartRemoveErrorInfo(cid, pid),
                    message: 'Cant remove product from cart',
                    code: EErrors.DATABASE_ERROR,
                })
            }
            const result = await this.cartService.removeProductFromCart(cid, pid)
      
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
            next(error)
            //res.status(500).send('Server error')
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cid } = req.params
            const { products } = req.body
            const result = await this.cartService.updateCart(cid, products)
        
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
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body
        
            const result = await this.cartService.updateProductQuantity(cid, pid, quantity)
        
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
            logger.error(error);
            res.status(500).send('Server error')
        }
    }

    deleteAllProducts = async (req, res) => {
        try {
            const { cid } = req.params
            const result = await this.cartService.deleteAllProducts(cid)
        
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
            logger.error(error)
            res.status(500).send('Server error')
        }
    }

    addProductToCart2 = async (req, res,next) => {
        try {
            const { pid } = req.params
            const user = req.session.user
            const cId = user.cart
            if (!user || !user.cart) {
                customError.createError({
                    name: 'Add product to cart error',
                    cause: generateCartErrorInfo(user, cId),
                    message: 'Error trying add product to cart',
                    code: EErrors.DATABASE_ERROR
                })
                /* return res.status(404).json({
                    status: 'error',
                    message: 'User not found or user does not have a cart',
                }) */
            }

            if (user.role === 'premium') {
                // Obtener información sobre el producto
                const productInfo = await this.productService.getProductById(pid)
    
                // Verificar si el producto pertenece al usuario
                if (productInfo.owner === user.email) {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Unauthorized to add this product to your cart',
                    })
                }
            }
            
            logger.info(cId)
            await this.cartService.addProductToCart(cId, pid)

            res.json({
                status: 'success',
                message: 'Product added to cart successfully',
            })
        } catch (error) {
            next(error)
            /* res.status(500).json({
                status: 'error',
                message: 'Server error',
            }) */
        }
    }

    purchaseCart = async (req, res) => {
        try {
            const { cid } = req.params
            
            const cart = await this.cartService.getCartById(cid)
            if (!cart) {
                return res.status(404).json({ status: 'error', message: 'Cart not found' })
            }
            const productUpdates = []
            const productsNotPurchased = []
            let totalAmount = 0
            for (const item of cart) {
                const productId = item.product.toString()
                const productArray = await this.productService.getProductById(productId)
                const product = productArray[0]
                const productPrice = product.price
                if (!product) {
                    return res.status(404).json({ status: 'error', message: 'Product not found' })
                }
                if (product.stock < item.quantity) {
                    productsNotPurchased.push(item.product)
                    continue
                    //return res.status(400).json({ status: 'error', message: `Not enough stock for product ${product._id}` })
                }
                product.stock -= item.quantity
                logger.info(product)
                productUpdates.push(this.productService.updateProduct(productId,
                    product.title, 
                    product.description, 
                    product.price, 
                    product.thumbnail, 
                    product.code, 
                    product.stock, 
                    product.status, 
                    product.category
                ))

                const quantity = item.quantity
                //console.log("Product Price:", productPrice)
                //console.log("Quantity:", quantity)
                totalAmount += (quantity * productPrice)
            }

            logger.info(totalAmount)
            const userEmail = req.session.user.email
            //console.log(userEmail)
            const ticketData = {
                code: 'TICKET-' + Date.now().toString(36).toUpperCase(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userEmail
            }
    
            const ticket = new this.ticketModel(ticketData)
            await ticket.save()

            if (productsNotPurchased.length > 0) {
                cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.product))
                await cart.save()
            } else {
                await this.cartService.deleteAllProducts(cid)
                logger.info('----------Cart empty----------')
            }
            try {
                await Promise.all(productUpdates)
                return res.status(200).json({ status: 'success', message: 'Stock updated successfully' })
            } catch (error) {
                return res.status(500).json({ status: 'error', message: 'Failed to update stock' })
            }
        } catch (error) {
            logger.error(error)
            res.status(500).json({ status: 'error', message: 'Server error' })
        }
    }

}

module.exports = CartController