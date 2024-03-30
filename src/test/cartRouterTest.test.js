const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const app = require('../app')
const { CartController } = require('../controllers/carts.controller')
const { cartDaoMongo } = require('../daos/mongo/cartDaoMongo')
const { cartService, userService, productService } = require('../repositories/service')


describe('Cart Router Tests', () => {
    it('Should get all carts', (done) => {
        chai.request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('array')
                done()
            })
    })

    it('Should create a new cart', (done) => {
        chai.request(app)
            .post('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })


    it('Should get a cart by ID', (done) => {
        const existingCartId = 'existingCartId'

        chai.request(app)
            .get(`/api/carts/${existingCartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })


    it('Should add a product to a cart', (done) => {
        const existingCartId = 'existingCartId'
        const existingProductId = 'existingProductId'

        chai.request(app)
            .put(`/api/carts/${existingCartId}/product/${existingProductId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                expect(res.body.payload).to.be.an('object')
                done()
            })
    })

    it('Should remove a product from a cart', (done) => {
        const existingCartId = 'existingCartId'
        const existingProductId = 'existingProductId'

        chai.request(app)
            .delete(`/api/carts/${existingCartId}/product/${existingProductId}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.equal('success')
                done()
            })
    })
})


describe('Cart Controller Tests', () => {

    it('Should create a new cart', async () => {

        const cartController = new CartController()

        const newCart = await cartController.createCart()

        expect(newCart).to.be.an('object')

    })
})
