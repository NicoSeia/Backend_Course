class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts = async({ limit = 10, pageNumber = 1, sort = null, query = '' } = {}) => await this.dao.get({ limit, pageNumber, sort, query })
    getProductById = async(pid) => await this.dao.getById(pid)
    addProduct = async(title, description, price, thumbnail, code, stock, status, category, owner) => await this.dao.add(title, description, price, thumbnail, code, stock, status, category, owner)
    updateProduct = async(pid, title, description, price, thumbnail, code, stock, status, category) => await this.dao.update(pid, title, description, price, thumbnail, code, stock, status, category)
    deleteProduct = async(pid) => await this.dao.delete(pid)

}

module.exports = ProductRepository