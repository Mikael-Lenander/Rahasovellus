const { REFRESH_TOKEN_EXPIRY_DAYS } = require('../config')
const mongoose = require('mongoose')
const { Schema } = mongoose

const refreshTokenSchema = new Schema({
	token: {
		type: String,
		required: true,
		unique: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRY_DAYS
	}
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
module.exports = RefreshToken
