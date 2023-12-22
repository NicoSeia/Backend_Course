const { productModel } = require("./models/product.model")

class productDaoMongo {
    constructor(){
        this.model = productModel
    }

    async addProduct(title, description, price, thumbnail, code, stock, status, category){
        
        const existingProduct = await this.model.findOne({ code })

        if (existingProduct) {
            console.log("This product has already been added")
        } else {
            if (!title || !description || !price || !code || !stock) {
              console.log("Incorrect product: One of these properties is not valid")
            }else{
                const lastProduct = await this.model.findOne({}, {}, { sort: { 'id': -1 } })
                const lastId = lastProduct ? lastProduct.id : 0
                const newProduct = new this.model({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category,
                })

                await newProduct.save()
            }
        }
    }

    async getProducts(){
        const products = await this.model.find({ isActive: true }).lean()
        return products
    }

    async getProductById(pid){
        const product = await this.model.findById(pid).lean()

        if (product) {
            return [product]
        } else {
            console.log("This product does not exist")
            return []
        }
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock, status, category){
        const updatedProduct = await this.model.findByIdAndUpdate(
            id,
            {
              $set: {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
              },
            },
            { new: true } 
        )
    
        if (updatedProduct) {
            console.log("Product updated successfully")
        } else {
            console.log("The product to be updated was not found")
        }
    }

    async deleteProduct(id){
        const product = await this.model.findById(id)
        if (product) {
            product.isActive = false

            await product.save()
    
            console.log("Product deactivated successfully")
        } else {
            console.log("No such product exists")
        }
    }

}

module.exports = productDaoMongo