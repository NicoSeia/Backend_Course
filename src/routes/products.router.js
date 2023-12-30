const { Router } = require('express')
const productManager = require('../daos/fileSystem/productManager')
const productDaoMongo = require('../daos/mongo/productDaoMongo')

const router = Router()
const productService = new productDaoMongo()

router
    .get('/', async (req,res)=>{
        try{
            const products = await productService.getProducts()
            return res.json({
                status: 'succes',
                payload: products
            });
        }catch (error){
            console.error(error);
            res.status(500).send('Server error');
        }
    })
    .get('/:pid', async (req,res)=>{
        try{
            const pid = req.params.pid
            const filteredProduct = await productService.getProductById(pid)
            if(filteredProduct){
                res.json({
                    status: 'succes',
                    payload: filteredProduct
                })
            }
            else{
                res.status(404).send("Product not exist")
            }
        }catch(error) {
            console.error(error)
            res.status(500).send('Server error')
        }
        })
    .post('/', async (req,res)=>{
        try {
            const {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
              status,
              category,
            } = req.body
        
            await productService.addProduct(title, description, price, thumbnail, code, stock, status, category);
        
              res.json({
                status: 'success',
                message: 'Product added successfully',
              });
            } catch (error) {
              console.error(error);
              res.status(500).send('Server error');
            }
    })
    .put('/:pid', async (req,res)=>{
        try{
            const pid = req.params.pid
            
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            await productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product updated successfully',
            })
        }catch(error){
            console.log(error);
            res.status(500).send('server error')
        }
    })
    .delete('/:pid', async (req,res)=>{
        try{
            const pid = req.params.pid;
            const deletedProduct = await productService.deleteProduct(pid);

            if (deletedProduct) {
                return res.json({
                    status: 'success',
                    message: 'Product deleted successfully'
                });
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
            })}
        }catch(error){
            console.log(error);
            res.status(500).send('server error')
        }
        

    })


module.exports = router
