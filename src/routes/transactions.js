const router = require('express').Router()
const datasetRouters = require('./transaction/dataset')
const Transaction = require('../models/transaction')
const User = require('../models/user')
const dayjs = require('dayjs')

router.use('/dataset', datasetRouters)

router.post('/new', async (req, res) => {
	const { userId, type, category, amount, date, comment = '' } = req.body
	let { _id, oldestTransactionDate } = req.user
	// {_id: '6097a739dfc47918600eb796', oldestTransactionDate: '5138-11-16T09:46:40.000+00:00'}
	const newTransaction = new Transaction({
		userId: userId,
		type: type,
		category: category,
		amount: Number(amount),
		date: new Date(date),
		comment: comment,
	})
	try {
		const transaction = await newTransaction.save()
		oldestTransactionDate = await updateOldestTransactionDate(date, oldestTransactionDate, _id)
		console.log('Transaction added')
		res.json({ transaction, oldestTransactionDate })
	} catch (error) {
		console.log(error)
	}
})

router.put('/update/:id', async (req, res) => {
	const id = req.params.id
	const { category, amount, date, comment } = req.body
	let { _id, oldestTransactionDate } = req.user
	try {
		const updatedTransaction = await Transaction.findByIdAndUpdate(
			id,
			{
				$set: {
					category: category,
					amount: Number(amount),
					date: new Date(date),
					comment: comment,
				},
			},
			{ useFindAndModify: false, new: true }
		)
		oldestTransactionDate = await updateOldestTransactionDate(date, oldestTransactionDate, _id)
		console.log('Transaction updated')
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
	let { oldestTransactionDate, _id: userId } = req.user
	try {
		const deletedTransaction = await Transaction.findOneAndDelete({ _id: id })
		if (dayjs(oldestTransactionDate).isSame(dayjs(deletedTransaction.date))) {
			const oldestTransaction = await Transaction.find({ userId: userId }).sort({ date: 1 }).limit(1)
			oldestTransactionDate = oldestTransaction[0]?.date || new Date(100000000000000)
			await User.findByIdAndUpdate(userId, { $set: { oldestTransactionDate: new Date(oldestTransactionDate) } }, { useFindAndModify: false })
		}
		console.log('Transaction deleted')
		res.send({
			transaction: deletedTransaction._id,
			oldestTransactionDate: oldestTransactionDate,
		})
	} catch (error) {
		console.log(error)
	}
})

async function updateOldestTransactionDate(date, oldestTransactionDate, userId) {
	if (new Date(date) < new Date(oldestTransactionDate)) {
		await User.findByIdAndUpdate(userId, { $set: { oldestTransactionDate: new Date(date) } }, { useFindAndModify: false })
		return date
	}
	return oldestTransactionDate
}

module.exports = router
