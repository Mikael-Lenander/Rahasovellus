const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('./config')

const authenticateToken = (req, res, next) => {
	try {
		const token = req.headers['authorization']?.substring(7)
		const user = verifyToken(token)
		req.user = user
		next()
	} catch (error) {
		return res.status(401).send({ error: 'Unauthorized' })
	}
}

const verifyToken = token => {
	if (token == null) throw Error('Unauthorized')
	const user = jwt.verify(token, ACCESS_TOKEN_SECRET)
	if (user == null) throw Error('Unauthorized')
	return user
}

module.exports = { authenticateToken }
