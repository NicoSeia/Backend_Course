const { Router } = require('express')
const { generateProducts } = require('../pruebas/pruebas')


const router = Router()

router.get('/mockingproducts', (req, res) =>{

    let products = []

    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }

    res.json({
        status: 'success',
        payload: products
    })
})

module.exports = router