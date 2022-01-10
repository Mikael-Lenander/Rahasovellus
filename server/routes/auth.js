const bcrypt = require('bcryptjs')
const User = require('../models/user')

authRouters = function(passport) {
    const router = require('express').Router()

    router.post('/register', (req, res) => {
        const {username, password, password2} = req.body

        let errorMessages = []
        if (username === '' || password === '' || password2 === '') errorMessages.push('Fill in all the fields')
        if (password !== password2) errorMessages.push("Passwords don't match")
        if (/\W/.test(username)) errorMessages.push('Username should only include letters, digits or _')
        if (username && username.length < 3) errorMessages.push('Username should be at least 3 characters long')
        if (password && password.length < 6 && password === password2) errorMessages.push('Password should be at least 6 characters long')

        User.findOne({username: username}, async (err, user) => {
            if (err) return res.json({messages: ['Registration failed'], success: false})
            if (user) return res.json({messages: [...errorMessages, 'User already exists'], success: false})
            if (errorMessages.length > 0) return res.json({messages: errorMessages, success: false})
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = new User({
                    username: username,
                    password: hashedPassword
                })
                newUser.save().then(() => {
                    res.json({messages: ['Registration successful'], success: true})
                    console.log('Registration successful')
                })
            }
            catch (err) {
                res.json({messages: ['Registration failed'], success: false})
            }
        })
    })
    
    router.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) return console.log(err)
            if (!user) return res.json({message: "Invalid username or password", success: false})
            req.logIn(user, (err) => {
                if (err) return console.log(err)
                console.log('Login successful')
                const {_id: id, joinedAt, username, initCapital, categories, oldestTransactionDate} = user
                res.json({message: "Login successful", success: true, user: {
                    id,
                    username,
                    initCapital,
                    categories,
                    joinedAt,
                    oldestTransactionDate
                }})
              })
        })(req, res, next)
      })
    
    router.get('/user', (req, res) => {
            if (!req.isAuthenticated()) {
                console.log('Session expired :(')
                return res.json({user: ''})
            } 
            const {_id: id, joinedAt, username, initCapital, categories, oldestTransactionDate} = req.user
            res.json({'user': {
                id,
                username,
                initCapital,
                categories,
                joinedAt,
                oldestTransactionDate
            }})
    })

    router.get('/logout', (req, res) => {
        req.logout();
        console.log('Logout successful')
        res.json({message: 'Logout successful', success: true})
      });

    return router
}

module.exports = authRouters