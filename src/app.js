const express = require('express')
const ProductManager = require('./productManager');
const app = express()

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    const limitedProducts = await productManager.getLimitedProducts(limit);
    if (!limit){
        return res.json(products);
    }else{
        return res.json(limitedProducts);
    }
});

app.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const filteredProduct = await productManager.getProductById(pid);
  if(filteredProduct){
    res.json(filteredProduct);
  }
  else{
    res.status(404).send("Product not exist");
  }
});


app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});

