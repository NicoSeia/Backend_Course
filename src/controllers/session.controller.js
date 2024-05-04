const { createHash, isValidPassword } = require('../utils/hashPassword')
const { generateToken } = require('../utils/createToken')
const { cartService, userService } = require('../repositories/service')
const { logger } = require('../utils/logger')
const multer = require('multer')
const { upload } = require('../utils/multer')
const { sendEmail } = require('../utils/sendMail')




class SessionController {
    constructor(){
        this.cartService = cartService
        this.userService = userService
    }

    register = async (req,res) =>{
        const { first_name, last_name, date, email, password, role} = req.body
        //console.log(first_name, last_name, date, email, password)
    
        if(first_name === '' || last_name === '' || email === '' || password === '') {
            return res.send('All fields must be required')
        }
        
        try {
            const existingUser = await this.userService.getUserBy({email})
    
            logger.info(existingUser)
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
                role,
            }
            /* console.log('======================', newUser) */
    
            const result = await this.userService.createUser(newUser)

            req.session.user = {
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email,
                cart: result.cart,
                role: result.role
            }
    
            const token = generateToken({
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email,
                cart: result.cart,
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
                    email: result.email,
                    role: result.role
                }
            })
        } catch (error) {
            logger.error('Error during user registration:', error)
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
            console.log(user)
            if(user.email === 'adminCoder@coder.com' && password === user.password){
    
                await this.userService.updateRole(user._id, 'admin')
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

                user.last_connection = new Date()
                await user.save()
    
                req.session.user = {
                    user: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    cart: user.cart,
                    role: user.role
                }
    
                const token = generateToken({
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    cart: user.cart,
                    role: user.role
                })
    
                res.cookie('token', token, {
                    maxAge: 60*60*1000*24,
                    httpOnly: true,
                }).redirect('/products')
            }
    
        } catch(error) {
            logger.error('Error during user login:', error)
            res.status(500).send({ status: 'error', error: 'Internal Server Error' })
        }
    }

    logout = async (req,res) =>{
        try{
            const user = req.session.user

            if (user) {
                const dbUser = await this.userService.getUserBy({ _id: user.user })
                if (dbUser) {
                    dbUser.last_connection = new Date()
                    await dbUser.save()
                }
            }
            req.session.destroy((err) =>{
                if(err){
                    logger.error('Error during session destruction:', err)
                    return res.status(500).send({ status: 'error', error: 'Internal Server Error' })
                }
    
                res.redirect('/login')
            })
        }catch(error) {
            logger.error('Error during logout:', error)
            res.status(500).send({ status: 'error', error: 'Internal Server Error' })
        }
    }

    current = (req,res) => {
        if (req.user) {
            const { first_name, last_name, role } = req.user
            const userDTO = {
                first_name: first_name,
                last_name: last_name,
                role: role
            }
            res.json(userDTO)
        } else {
            res.status(401).json({ error: "Unauthorized" })
        }
    }

    github = async (req,res)=>{}

    githubCallback = (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    }

    toggleUserRole = async (req, res, next) => {
        try {
            const { uid } = req.params
            console.log("---------------------",uid)
            const user = await this.userService.getUserBy({_id: uid})
            console.log('user: ', user)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            if (user.role === 'premium') {
                user.role = 'user'
                await user.save()
                return res.status(200).json({ message: 'User role updated to user' })
            }
    
            const documentCount = user.documents.length
            if (documentCount >= 3) {
                if (user.role != 'premium') {
                    user.role = 'premium'
                    await user.save()
    
                    return res.status(200).json({ message: 'User role changed to premium' })
                } else {
                    return res.status(200).json({ message: 'User is already premium' })
                }
            } else {
                return res.status(400).json({ message: 'User has not uploaded enough documents to change role to premium' })
            }

        } catch (error) {
            next(error)
        }
    }

    user = async (req, res, next) => {
        try {
            const uid = req.params.uid
            console.log("=======", uid)
            const user = await this.userService.getUserBy({_id: uid})
            console.log(user)
            res.json({payload: user})
        } catch (error){
            next(error)
        }
    }

    uploadsMulter = async (req, res) => {
        try {
            const uid = req.params.uid
            const files = req.files
            //console.log("Received files:", files)
    
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' })
            }

            const user = await this.userService.getUserBy({ _id: uid })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
    
            const documents = []

            for (const [fieldName, fileArray] of Object.entries(files)) {
                fileArray.forEach(file => {
                    documents.push({
                        name: file.originalname,
                        reference: file.path,
                    })
                })
            }
    
            user.documents = user.documents.concat(documents)
    
            await user.save()
    
            res.status(200).json({
                message: 'Documentos subidos con éxito',
                documents: documents.map(doc => ({
                    name: doc.name,
                    reference: doc.reference,
                })),
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    uploadsMulterView = async (req, res) => {
        try {
            const uid = req.params.uid
    
            res.render('uploadFiles', { uid })
        } catch (error) {
            console.error('Error to render upload files view:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getUsers()

            const userList = users.map(user => ({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }))

            res.json({ status: 'success', payload: userList })
        } catch (error) {
            console.error('Error fetching users:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            const now = new Date()
            const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000))
             
            const inactiveUsers = await this.userService.findInactiveUsers(twoDaysAgo)
            
            if (inactiveUsers.length === 0) {
                return res.status(200).json({ message: 'No inactive users found' })
            }
            
            for (const user of inactiveUsers) {
                await this.userService.deleteUser(user._id)
                
                const subject = 'Account deleted by inactivity'
                const html = `
                    <div>
                        <h2>Hi ${user.first_name},</h2>
                        <p>Your account has been deleted due to inactivity of two or more days. If you have any questions, please contact us!.</p>
                    </div>`
                await sendEmail(user.email, subject, html)
            }
            
            res.status(200).json({ message: `Removed ${inactiveUsers.length} inactive users` })
        } catch (error) {
            console.error('Error deleting inactive users:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }

}

module.exports = SessionController