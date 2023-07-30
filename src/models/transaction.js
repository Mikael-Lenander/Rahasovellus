const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ['income', 'expense']
	},
	category: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true,
		min: 0
	},
	date: {
		type: Date,
		required: true
	},
	comment: {
		type: String
	}
})

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
