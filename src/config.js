if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const PORT = process.env.PORT || 5001
const DB_URI = process.env.DB_URI
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRY_DAYS = 7
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('Missing required JWT secret environment variables')
}
if (!DB_URI) {
	throw new Error('Missing required DB_URI environment variable')
}
module.exports = { PORT, DB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY_DAYS }
