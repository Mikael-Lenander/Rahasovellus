const config = require('./config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const authRouters = require('./routes/auth')
const transactionRouters = require('./routes/transactions')
const userRouters = require('./routes/user')
const middleware = require('./middleware')

const app = express()
const PORT = config.PORT

mongoose.connect(config.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
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
		origin: ['https://rahasovellus.herokuapp.com', 'http://localhost:3000', 'http://localhost:5001', 'https://rahasovellus.onrender.com'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})
)

app.use('/api', authRouters)
app.use('/api/transaction', middleware.authenticateToken, transactionRouters)
app.use('/api/user', middleware.authenticateToken, userRouters)

app.get('*', (req, res) => {
	const staticPath = path.join(path.dirname(__dirname), 'build/index.html')
	res.sendFile(staticPath)
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
