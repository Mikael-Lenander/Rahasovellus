const bcrypt = require('bcryptjs')
const authService = require('../services/authService')
const User = require('../models/user')
const { REFRESH_TOKEN_SECRET } = require('../config')
const jwt = require('jsonwebtoken')

const router = require('express').Router()

router.post('/refresh', async (req, res) => {
	try {
		const refreshToken = req.body?.refreshToken
		if (refreshToken == null) {
			console.log('No refresh token provided')
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const tokenValid = await authService.isValidToken(refreshToken)
		if (!tokenValid) {
			console.log('Token not in database')
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
		const userPayload = { username: user.username, _id: user._id }
		await authService.removeToken(refreshToken)
		const newTokens = await authService.generateTokens(userPayload)
		res.json({ ...newTokens, ...userPayload })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

router.post('/register', async (req, res) => {
	const { username, password, password2 } = req.body

	let errorMessages = []
	if (username === '' || password === '' || password2 === '') errorMessages.push('Fill in all the fields')
	if (password !== password2) errorMessages.push("Passwords don't match")
	if (/\W/.test(username)) errorMessages.push('Username should only include letters, digits or _')
	if (username && username.length < 3) errorMessages.push('Username should be at least 3 characters long')
	if (password && password.length < 6 && password === password2) errorMessages.push('Password should be at least 6 characters long')

	const existingUser = await User.findOne({ username }).exec()
	if (existingUser)
		return res.json({
			messages: [...errorMessages, 'User already exists'],
			success: false
		})
	if (errorMessages.length > 0) return res.json({ messages: errorMessages, success: false })

	try {
		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = new User({
			username,
			password: hashedPassword
		})
		await newUser.save()
		res.json({ messages: ['Registration successful'], success: true })
		console.log('Registration successful')
	} catch (err) {
		res.json({ messages: ['Registration failed'], success: false })
	}
})

router.post('/login', async (req, res) => {
	try {
		const credentials = req.body
		const user = await User.findOne({ username: credentials.username })
		if (!user) return res.status(400).json({ error: 'Invalid username or password' })
		const passwordCorrect = await bcrypt.compare(credentials.password, user.password)
		if (!passwordCorrect) {
			console.log('Wrong password for user', credentials.username)
			return res.status(401).json({ error: 'Invalid username or password' })
		}
		const userPayload = { username: user.username, _id: user._id }
		const { accessToken, refreshToken } = await authService.generateTokens(userPayload)
		const { _id: id, joinedAt, username, initCapital, categories, oldestTransactionDate } = user
		res.json({
			message: 'Login successful',
			success: true,
			user: {
				id,
				username,
				initCapital,
				categories,
				joinedAt,
				oldestTransactionDate,
				accessToken,
				refreshToken
			}
		})
	} catch (error) {
		res.status(400).send({ error: error.message })
	}
})

router.post('/logout', async (req, res) => {
	try {
		const refreshToken = req.body?.refreshToken
		if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' })
		const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
		await authService.removeUserTokens(user._id)
		res.json({ message: 'Logout successful', success: true })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

module.exports = router
