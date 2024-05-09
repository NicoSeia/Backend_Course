const { logger } = require("../../utils/logger")
const { productModel } = require("./models/product.model")

class productDaoMongo {
    constructor(){
        this.model = productModel
    }

    async add({title, description, price, thumbnail, code, stock, status, category, owner}){
        console.log("Dao :", title, description, price, thumbnail, code, stock, status, category, owner)
        const existingProduct = await this.model.findOne({ code })
        console.log(existingProduct)
        if (existingProduct) {
            const error = new Error("This product has already been added")
            error.code = 'PRODUCT_EXISTS'
            throw error
        } else {
            if (!title || !description || !price || !code || !stock) {
                const error = new Error("Incorrect product: One of these properties is not valid")
                error.code = 'INVALID_PRODUCT'
                throw error
            }
            const newProduct = new this.model({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
                owner,
            });
        
            console.log("New product object:", newProduct);
        
            try {
                await newProduct.save();
                console.log("Product saved successfully");
                return newProduct;
            } catch (error) {
                console.error("Error saving product:", error);
                throw error;
            }
        
        }
    }

    async get({ limit = 10, pageNumber, sort, query } = {}){
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
        try {
            const result = await this.model.deleteOne({ _id: pid })
    
            if (result.deletedCount > 0) {
                logger.info("Product deleted successfully")
                return { success: true, message: "Product deleted successfully" }
            } else {
                const errorMessage = "No such product exists"
                logger.error(errorMessage)
                throw new Error(errorMessage)
            }
        } catch (error) {
            logger.error("Error deleting product:", error)
            throw error
        }
    }

}

module.exports = productDaoMongo