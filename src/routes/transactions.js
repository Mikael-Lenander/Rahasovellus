const router = require('express').Router()
const Transaction = require('../models/transaction')
const User = require('../models/user')
const dayjs = require('dayjs')

router.post('/new', async (req, res) => {
	const { userId, type, category, amount, date, comment = '' } = req.body
	const user = await User.findById(userId)
	if (!user) return res.status(404).json({ error: 'User not found' })
	const newTransaction = new Transaction({
		userId: userId,
		type: type,
		category: category,
		amount: Number(amount),
		date: new Date(date),
		comment: comment
	})
	try {
		const transaction = await newTransaction.save()
		const oldestTransactionDate = await updateOldestTransactionDate(date, user.oldestTransactionDate, user._id)
		res.json({ transaction, oldestTransactionDate })
	} catch (error) {
		console.log(error)
	}
})

router.put('/update/:id', async (req, res) => {
	const id = req.params.id
	const { category, amount, date, comment } = req.body
	const user = await User.findById(req.user._id)
	if (!user) return res.status(404).json({ error: 'User not found' })
	try {
		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{
				$set: {
					category: category,
					amount: Number(amount),
					date: new Date(date),
					comment: comment
				}
			},
			{ useFindAndModify: false, new: true }
		)
		const oldestTransactionDate = await updateOldestTransactionDate(date, user.oldestTransactionDate, user._id)
		res.json({ transaction: updatedTransaction, oldestTransactionDate })
	} catch (error) {
		console.log(error)
	}
})

router.get('/all', (req, res) => {
	const { _id: userId } = req.user
	Transaction.find({ userId }, (err, data) => {
		if (err) return console.log(err)
		res.json(data)
	})
})

router.delete('/delete/:id', async (req, res) => {
	const id = req.params.id
	const user = await User.findById(req.user._id)
	if (!user) return res.status(404).json({ error: 'User not found' })
	try {
		const deletedTransaction = await Transaction.findOneAndDelete({ _id: id })
		if (!deletedTransaction) return res.status(404).json({ error: 'Transaction not found' })
		let oldestTransactionDate = user.oldestTransactionDate
		if (dayjs(user.oldestTransactionDate).isSame(dayjs(deletedTransaction.date))) {
			const oldestTransaction = await Transaction.find({ userId: user._id }).sort({ date: 1 }).limit(1)
			oldestTransactionDate = oldestTransaction[0]?.date || null
			await User.findByIdAndUpdate(user._id, { $set: { oldestTransactionDate } }, { useFindAndModify: false })
		}
		console.log('Transaction deleted')
		res.send({
			transaction: deletedTransaction._id,
			oldestTransactionDate
		})
	} catch (error) {
		console.log(error)
	}
})

async function updateOldestTransactionDate(date, oldestTransactionDate, userId) {
	if (oldestTransactionDate == null || new Date(date) < new Date(oldestTransactionDate)) {
		await User.findByIdAndUpdate(userId, { $set: { oldestTransactionDate: new Date(date) } }, { useFindAndModify: false })
		return date
	}
	return oldestTransactionDate
}

module.exports = router
