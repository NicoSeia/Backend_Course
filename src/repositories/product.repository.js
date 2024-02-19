class ProductRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts = async() => await this.dao.get()
    getProductById = async(pid) => await this.dao.getById(pid)
    addProduct = async(title, description, price, thumbnail, code, stock, status, category) => await this.dao.add(title, description, price, thumbnail, code, stock, status, category)
    updateProduct = async(pid, title, description, price, thumbnail, code, stock, status, category) => await this.dao.update(pid, title, description, price, thumbnail, code, stock, status, category)
    deleteProduct = async(pid) => await this.dao.delete(pid)

}

module.exports = ProductRepository