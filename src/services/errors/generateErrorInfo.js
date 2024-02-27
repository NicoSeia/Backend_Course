const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
        list of requires properties
        - Product: product not found, recived ${product}
        - Product not added: can't add new product to database
        - Product no deleted: not found a product to delete
    `
}

const generateCartErrorInfo = (user, cartId) => {
    return `One or more properties were incomplete or not valid.
        list of requires properties
        - Product not added to cart: can't add product to cart, recived ${user} and ${cartId}
    `
}

const generateCartRemoveErrorInfo = (cid, pid) => {
    return `One or more properties were incomplete or not valid.
        list of requires properties
        - Product not removed to cart: can't remove product to cart, recived ${cid} and ${pid}
    `
}

module.exports = {
    generateProductErrorInfo,
    generateCartErrorInfo,
    generateCartRemoveErrorInfo
}