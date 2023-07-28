if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const passportConfig = require('./passportConfig')
const authRouters = require('./routes/auth')
const transactionRouters = require('./routes/transactions')
const userRouters = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	console.log('Connected to database successfully')
})

app.use(express.static('build'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
	cors({
		origin: ['https://rahasovellus.herokuapp.com'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
)

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false,
		proxy: true,
		cookie: {
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'none',
			maxAge: 60 * 60 * 24 * 1000,
		},
	})
)
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

const isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' })
	next()
}

app.use('/api', authRouters(passport))
app.use('/api/transaction', isAuthenticated, transactionRouters)
app.use('/api/user', isAuthenticated, userRouters)

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/build/index.html'))
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
