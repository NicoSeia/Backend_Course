const { faker } = require('@faker-js/faker')

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        stock: faker.string.numeric(),
        category: faker.word.noun(),
    }
}

module.exports = {
    generateProducts,
}