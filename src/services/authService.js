const RefreshToken = require('../models/token')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY_DAYS } = require('../config')
const jwt = require('jsonwebtoken')

const addToken = async (token, userId) => {
	return RefreshToken.create({ token, user: userId })
}

const removeToken = async token => {
	return RefreshToken.deleteOne({ token })
}

const removeUserTokens = async userId => {
	return RefreshToken.deleteMany({ user: userId })
}

const isValidToken = async token => {
	return Boolean(await RefreshToken.findOne({ token }))
}

const generateTokens = async user => {
	const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
	const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` })
	await addToken(refreshToken, user._id)
	return { accessToken, refreshToken }
}

module.exports = { removeToken, isValidToken, removeUserTokens, generateTokens }
