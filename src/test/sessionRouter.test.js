const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../../app')
const SessionController = require('../controllers/sessionController')
const { userDaoMongo } = require('../daos/mongo/userDaoMongo')


chai.use(chaiHttp)
const expect = chai.expect

describe('SessionController', () => {
    let sessionController

    before(() => {
        sessionController = new SessionController()
    })

    describe('register', () => {
        it('should register a new user', (done) => {
            const newUser = {
                first_name: 'John',
                last_name: 'Doe',
                date: '1990-01-01',
                email: 'john.doe@example.com',
                password: 'password',
                role: 'user'
            }

            chai.request(app)
                .post('/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('status').equal('success')
                    expect(res.body.payload).to.have.property('email').equal(newUser.email)
                    done()
                })
        })
    })

    describe('login', () => {
        it('should login an existing user', (done) => {
            const existingUser = {
                email: 'john.doe@example.com',
                password: 'password'
            }

            chai.request(app)
                .post('/login')
                .send(existingUser)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res).to.have.cookie('token') 
                    done()
                })
        })
    })
})

describe('Test userDao', ()=>{
    before(function() {
        this.userDao = new userDaoMongo()
    })
    beforeEach(function(){
        this.timeout(2000)
    })

    it('Dao must get an array of all user', async function(){
        const response = await this.userDao.get({})
        expect(response).to.not.be.equal([])
    })
})