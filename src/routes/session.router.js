const { Router } = require('express')
const { userModel } = require('../daos/mongo/models/user.model')

const router = Router()

router.post('/register', async (req,res) =>{
    const { first_name, last_name, date, email, password} = req.body
    //console.log(first_name, last_name, date, email, password)

    if(first_name === '' || last_name === '' || email === '' || password === '') {
        return res.send('All fields must be required')
    }

    try {
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.send({ status: 'error', error: 'This user already exists' })
        }

        const newUser = {
            first_name,
            last_name,
            date,
            email,
            password,
            role: 'user'
        }

        const result = await userModel.create(newUser)

        res.send({
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
})

router.post('/login', async (req,res) => {
    const { email, password } = req.body

    if(email === '' || password === '') {
        return res.send('All fields must be required')
    }

    try{
        const user = await userModel.findOne({ email })
        console.log(user.email)

        if(user.email === 'adminCoder@coder.com' && password === user.password){
            req.session.user = {
                role: 'admin'
            }
            res.redirect('/products')
        }
        else{

            if (!user) {
                return res.send('email or password not valid')
            }

            if (password !== user.password) {
                return res.send('email or password not valid')
            }

            req.session.user = {
                user: user._id,
                role: user.role
            }

            res.redirect('/products')
        }

    } catch(error) {
        console.error('Error during user login:', error)
        res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
})

router.get('/logout', async (req,res) =>{
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
})

module.exports = router