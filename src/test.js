async function asyncThings(){

    const ProductManager = require("./productManager");

    // Instance new class
    const product = new ProductManager("./products.json");

    await product.addProduct('Product test', 'This a test product', 200, 'Without image', 'abc123', 25);
    await product.addProduct('Product 2 test', 'This a test product 2', 100, 'Without image', 'abc456', 20);
    await product.addProduct('Product 3 test', 'This a test product 3', 140, 'Without image', 'abc456', 10);
    await product.addProduct('Product 3 test', 'This a test product 3', 145, 'Without image', 'def123', 100);
    await product.addProduct('Product 4 test', 'This a test product 4', 170, 'Without image', 'def456', 110);
    await product.addProduct('Product 4 test', '', 180, 'Without image', 'abc789', 18);
    await product.updateProduct(2, "Product update test", "This a test product update", 1000, "Without image", "abc789", 100);
    //await product.deleteProduct(2);

    console.log("Products: ");
    const products = await product.getProducts();
    console.log(products);
    /* console.log("Product found: ")
    const productsById = await product.getProductById(2);
    console.log(productsById);
    const productsById_2 = await product.getProductById(4);
    console.log(productsById_2); */
    /* console.log("Product updated: ")
    const pruductUpdated = await product.getProducts()
    console.log(pruductUpdated); */
    /* const newProducts = await product.getProducts();
    console.log(newProducts); */
}

asyncThings();