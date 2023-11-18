const express = require('express')
const ProductManager = require('./productManager');
const app = express()

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
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

app.get('/products', async (req, res) => {
  let limit = req.query.limit;
  const limitedProducts = await productManager.getLimitedProducts(limit);
  res.json(limitedProducts);
});


app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});

