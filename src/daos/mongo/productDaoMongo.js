const { logger } = require("../../utils/logger")
const { productModel } = require("./models/product.model")

class productDaoMongo {
    constructor(){
        this.model = productModel
    }

    async add(title, description, price, thumbnail, code, stock, status, category){
        
        const existingProduct = await this.model.findOne({ code })

        if (existingProduct) {
            logger.info("This product has already been added")
        } else {
            if (!title || !description || !price || !code || !stock) {
              logger.error("Incorrect product: One of these properties is not valid")
            }else{
                const lastProduct = await this.model.findOne({}, {}, { sort: { 'id': -1 } })
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

    async get({ limit = 10, pageNumber = 1, sort, query } = {}){
        const filter = { isActive: true }
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
            ]
        }
        const options = {
            limit: parseInt(limit),
            page: parseInt(pageNumber),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        }

        const result = await this.model.paginate(filter, options)
        return {
            docs: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        }
    }

    async getById(pid){
        const product = await this.model.findOne({ _id: pid }).lean()

        if (product) {
            return [product]
        } else {
            logger.error("This product does not exist")
            return []
        }
    }

    async update(id, title, description, price, thumbnail, code, stock, status, category){
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
            logger.info("Product updated successfully")
        } else {
            logger.error("The product to be updated was not found")
        }
    }

    async delete(pid){
        const product = await this.model.findOne({ _id: pid })
        if (product) {
            product.isActive = false

            await product.save()
    
            logger.info("Product deactivated successfully")
        } else {
            logger.error("No such product exists")
        }
    }

}

module.exports = productDaoMongo