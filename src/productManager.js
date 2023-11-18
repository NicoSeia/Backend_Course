const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = "./products.json";
        this.products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        let id = 0;
        for (let i = 0; i < this.products.length; i++) {
            const element = this.products[i];
            if(element.id > id){
                id = element.id;
            }
        }
        id++;

        if(this.products.find(product => product.code === code)){
            console.log("This product has already been added");
        }
        else{
            if(!title || !description || !price || !thumbnail || !code || !stock){
                console.log("Incorrect product: One of these properties is not valid");
            }
            else{
                this.products.push({id: id, title, description, price, thumbnail, code, stock});
                const productsJson = JSON.stringify(this.products, null, 2);
                await fs.promises.writeFile('products.json', productsJson);
            }
        }
    }

    async getProducts() {
        let productsInJson = await fs.promises.readFile("products.json", "utf-8"); 
        productsInJson = JSON.parse(productsInJson);
        return productsInJson;
    }

    async getLimitedProducts(limit) {
        let productsInJson = await fs.promises.readFile("products.json", "utf-8");
        productsInJson = JSON.parse(productsInJson);
    
        if (parseInt(limit) <= 0) {
            console.log("Invalid limit");
        } else {
            return productsInJson.slice(0, parseInt(limit));
        }
    }

    async getProductById(id) {
        let productsInJson = await fs.promises.readFile("products.json", "utf-8"); 
        productsInJson = JSON.parse(productsInJson);
        const filteredProduct = productsInJson.filter(product => product.id === parseInt(id));
        if(filteredProduct.length !== 0){
            return filteredProduct;
        }
        else{
            console.log("This product does not exist");
        }
        
    }

    async updateProduct(id, title, description, price, thumbnail, code, stock){
        const products = await this.getProducts();
        const existingProductIndex = products.findIndex(product => product.id === id);

    if (existingProductIndex !== -1) {
        products[existingProductIndex] = {
            ...products[existingProductIndex],
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        }
        else{
            console.log("The product to be updated was not found")
        }
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const indexToDelete = products.findIndex((product)=> product.id===id);
        if(indexToDelete!==-1){
            products.splice(indexToDelete, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        }else{
            console.log('No such product exists')
        }
    }
}

module.exports = ProductManager;