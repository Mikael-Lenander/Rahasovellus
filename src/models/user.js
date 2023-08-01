const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	initCapital: {
		type: Number,
		min: 0,
		default: 0
	},
	categories: {
		income: {
			type: [String],
			default: ['Salary', 'Benefits', 'Investments', 'Gifts', 'Other']
		},
		expense: {
			type: [String],
			default: ['Living', 'Groceries', 'Transport', 'Education', 'Hobbies and exercise', 'Entertainment', 'Phone and internet', 'Credit', 'Other']
		}
	},
	joinedAt: {
		type: Date,
		default: new Date()
	},
	oldestTransactionDate: {
		type: Date
	}
})

const User = mongoose.model('User', userSchema)
module.exports = User
