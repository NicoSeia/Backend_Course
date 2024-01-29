const passport = require('passport')
const userDaoMongo = require('../daos/mongo/userDaoMongo')
const userService = new userDaoMongo()
const GithubStrategy = require('passport-github2')
/* 
exports.initializePassport = () => {

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.808573ac63896670',
        clientSecret: 'abc17a69f5bd16ab15c686dbc4455c64540e016b',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accesToken, refreshToken, profile, done)=>{
        try{
            console.log(profile)
            let user = await userService.getUserBy({email: profile._json.email})
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: '123'
                }
                let result = await userService.createUser(newUser)
                console.log("Este es el nuevo usaurio", result)
                return done(null, result)
            }
            done(null, user)
        }catch(err){
            return done(err)
        }
    }))

    // save and take sessions user credentials
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserBy({_id: id})
        done(null, user)
    })

} */