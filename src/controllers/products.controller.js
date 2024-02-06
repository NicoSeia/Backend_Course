const productDaoMongo = require('../daos/mongo/productDaoMongo')

class ProdcutsController {
    constructor(){
        this.productService = new productDaoMongo()
    }

    getProducts = async (req,res)=>{
        try{
            const products = await this.productService.getProducts()
            return res.json({
                status: 'succes',
                payload: products
            });
        }catch (error){
            console.error(error);
            res.status(500).send('Server error');
        }
    }

    getProductById = async (req,res)=>{
        try{
            const pid = req.params.pid
            const filteredProduct = await this.productService.getProductById(pid)
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
    }

    addProduct = async (req,res)=>{
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
        
            await this.productService.addProduct(title, description, price, thumbnail, code, stock, status, category);
        
              res.json({
                status: 'success',
                message: 'Product added successfully',
              });
            } catch (error) {
              console.error(error);
              res.status(500).send('Server error');
        }
    }

    updateProduct = async (req,res)=>{
        try{
            const pid = req.params.pid
            
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Product updated successfully',
            })
        }catch(error){
            console.log(error);
            res.status(500).send('server error')
        }
    }

    deleteProduct = async (req,res)=>{
        try{
            const pid = req.params.pid;
            const deletedProduct = await this.productService.deleteProduct(pid);

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
    }


}

module.exports = ProdcutsController