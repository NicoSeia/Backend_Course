class CartRepository {
    constructor(dao){
        this.dao = dao
    }

    getCarts = async() => await this.dao.get()
    createCart = async() => await this.dao.create()
    getCartById = async(cid) => await this.dao.getById(cid)
    addProductToCart = async(cartId, productId) => await this.dao.add(cartId, productId)
    removeProductFromCart = async(cid, pid) => await this.dao.remove(cid, pid)
    updateCart = async(cid, products) => await this.dao.update(cid, products)
    updateProductQuantity = async(cid, pid, quantity) => await this.dao.updateQuantity(cid, pid, quantity)
    deleteAllProducts = async(cid) => await this.dao.deleteAll(cid)
    addProductToCart2 = async(pid) => await this.dao.add(cartId, pid)

}

module.exports = CartRepository