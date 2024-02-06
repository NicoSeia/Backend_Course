const userDaoMongo = require('../daos/mongo/userDaoMongo')
const cartDaoMongo = require('../daos/mongo/cartDaoMongo')
const { createHash, isValidPassword } = require('../util/hashPassword')
const { generateToken } = require('../util/createToken')


class SessionController {
    constructor(){
        this.userService = new userDaoMongo()
        this.cartService = new cartDaoMongo()
    }

    register = async (req,res) =>{
        const { first_name, last_name, date, email, password} = req.body
        //console.log(first_name, last_name, date, email, password)
    
        if(first_name === '' || last_name === '' || email === '' || password === '') {
            return res.send('All fields must be required')
        }
        
        try {
            const existingUser = await this.userService.getUserBy({email})
    
            console.log(existingUser)
            if (existingUser) {
                return res.send({ status: 'error', error: 'This user already exists' })
            }
    
            const cart = await this.cartService.createCart()
    
            const newUser = {
                first_name,
                last_name,
                date,
                email,
                password: createHash(password),
                cart: cart._id,
                role: 'user'
            }
    
            const result = await this.userService.createUser(newUser)
    
            const token = generateToken({
                id: result._id,
                role: result.role
            })
    
            res.cookie('token', token, {
                maxAge: 60*60*1000*24,
                httpOnly: true,
            }).send({
                status: 'success',
                payload: {
                    id: result._id,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    email: result.email
                }
            })
        } catch (error) {
            console.error('Error during user registration:', error)
            res.status(500).send({ status: 'error', error: 'Internal Server Error' })
        }
    }

    login = async (req,res) => {
        const { email, password } = req.body
    
        if(email === '' || password === '') {
            return res.send('All fields must be required')
        }
    
        try{
            const user = await this.userService.getUserBy({ email })
    
            if(user.email === 'adminCoder@coder.com' && password === user.password){
    
                await this.userService.updateUserRole(user._id, 'admin')
                console.log('-----------')
                req.session.user = {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: 'admin'
                }
                const token = generateToken({
                    id: user._id,
                    role: user.role
                })
    
                res.cookie('token', token, {
                    maxAge: 60*60*1000*24,
                    httpOnly: true,
                }).redirect('/products')
            }
            else{
    
                if (!user) {
                    return res.send('email or password not valid')
                }
    
                if (!isValidPassword(password, { password: user.password })) {
                    return res.send('email or password not valid')
                }
    
                req.session.user = {
                    user: user._id,
                    role: user.role
                }
    
                const token = generateToken({
                    id: user._id,
                    role: user.role
                })
    
                res.cookie('token', token, {
                    maxAge: 60*60*1000*24,
                    httpOnly: true,
                }).redirect('/products')
            }
    
        } catch(error) {
            console.error('Error during user login:', error)
            res.status(500).send({ status: 'error', error: 'Internal Server Error' })
        }
    }

    logout = async (req,res) =>{
        try{
            req.session.destroy((err) =>{
                if(err){
                    console.error('Error during session destruction:', err)
                    return res.status(500).send({ status: 'error', error: 'Internal Server Error' })
                }
    
                res.redirect('/login')
            })
        }catch(error) {
            console.error('Error during logout:', error)
            res.status(500).send({ status: 'error', error: 'Internal Server Error' })
        }
    }

    current = (req,res) => {
        res.send('sensible data')
    }

    github = async (req,res)=>{}

    githubCallback = (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    }
}

module.exports = SessionController