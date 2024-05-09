const { productService, userService } = require('../repositories/service')
const customError = require('../services/errors/customError')
const { EErrors } = require('../services/errors/enum')
const { generateProductErrorInfo } = require('../services/errors/generateErrorInfo')
const { logger } = require('../utils/logger')
const { sendEmail } = require('../utils/sendMail')


class ProdcutsController {
    constructor(){
        this.productService = productService
        this.userService = userService
    }

    getProducts = async (req,res)=>{
        try{
            const { limit, pageNumber, sort, query } = req.query
        
            const parsedLimit = parseInt(limit) || 10
            const parsedPageNumber = parseInt(pageNumber) || 1
            const sortOrder = sort === 'asc' ? 1 : -1

            const productsData = await this.productService.getProducts({
                limit: parsedLimit,
                pageNumber: parsedPageNumber,
                sort: sortOrder,
                query: query || '',
            })
            res.json({
                status: 'success',
                payload: productsData,
            })


        }catch (error){
            console.error(error)
            res.status(500).send('Server error')
        }
    }

    getProductById = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            if(!pid){
                customError.createError({
                    name: 'Not found a product',
                    cause: generateProductErrorInfo(filteredProduct),
                    message: 'Error, trying to found a product',
                    code: EErrors.DATABASE_ERROR,
                })
                //res.status(404).send("Product not exist")
            }
            const filteredProduct = await this.productService.getProductById(pid)
            res.json({
                status: 'succes',
                payload: filteredProduct
            })    
        }catch(error) {
            next(error)
                //res.status(500).send('Server error')
        }
    }

    addProduct = async (req,res,next)=>{
        try {
            const {
              product,
              user
            } = req.body
            console.log(product.title,
                product.description,
                product.price,
                product.thumbnail,
                product.code,
                product.stock,
                product.status,
                product.category,
                user)

            
            
            if (user.role !== 'premium' && user.role !== 'admin') {
                return res.status(403).json({ status: 'error', message: 'Only user premium or admin can create product' })
            }
            console.log('pase el verificador, soy admin')

            const owner = user.id
            const newProduct = await this.productService.addProduct({
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                status: product.status,
                category: product.category,
                owner,    
            })
            res.json({
                status: 'success',
                payload: {
                    product: {
                        title: newProduct.title,
                        description: newProduct.description,
                        price: newProduct.price,
                        thumbnail: newProduct.thumbnail,
                        code: newProduct.code,
                        stock: newProduct.stock,
                        status: newProduct.status,
                        category: newProduct.category,
                        owner: newProduct.owner,
                    }
                },
                message: 'Product added successfully',
            })
        } catch (error) {
            if (error.code === 'PRODUCT_EXISTS') {
                res.status(400).json({ status: 'error', message: 'Product already exists' })
            } else if (error.code === 'INVALID_PRODUCT') {
                res.status(400).json({ status: 'error', message: 'Invalid product data' })
            } else {
                res.status(500).json({ status: 'error', message: 'Server error' })
            }
        }
    }

    updateProduct = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Product to update error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to update a product',
                    code: EErrors.DATABASE_ERROR
                })
            }
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product updated successfully',
            })
        }catch(error){
            next(error)
            //res.status(500).send('server error')
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const { user } = req.body
            console.log(pid)
            console.log(user)
    
            const product = await this.productService.getProductById(pid)
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            }
            console.log(product)
            console.log(user.role)
            if (user.role === 'admin' || product.owner.equals(user._id)) {
                const deletedProduct = await this.productService.deleteProduct(pid)
                if (deletedProduct) {
                    if (product.owner && user.role === 'premium') {
                        const ownerEmail = product.owner.email
                        const subject = 'Product Deleted'
                        const html = `
                            <p>Dear ${product.owner.first_name},</p>
                            <p>We would like to inform you that your product "${deletedProduct.title}" has been deleted from our platform.</p>
                            <p>If you have any questions, please do not hesitate to contact us.</p>
                            <p>Thank you for using our platform.</p>
                        `

                        await sendEmail(ownerEmail, subject, html)
                    }
                    
                    return res.json({ status: 'success', message: 'Product deleted successfully' })
                }
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            } else {
                return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this product' })
            }
        } catch (error) {
            next(error)
        }
    };


}

module.exports = ProdcutsController