const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRouter = require('./routes/products.router.js')
const cartRouter = require('./routes/carts.router.js')

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080`);
});

module.exports = app;