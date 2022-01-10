require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const passportConfig = require('./passportConfig')
const authRouters = require('./routes/auth')
const transactionRouters = require('./routes/transactions')
const userRouters = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database successfully')
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
  origin: ["https://rahasovellus.netlify.app", "http://localhost:3000", "https://rahaseuranta.netlify.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 1000
  }
}))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return res.send('No auth')
  next()
}

app.get('/', (req, res) => {
  res.send('rahasovellus')
})

app.use('/', authRouters(passport))
app.use('/transaction', isAuthenticated, transactionRouters)
app.use('/user', isAuthenticated, userRouters)

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})