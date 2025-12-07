const router = require('express').Router()
const User = require('../models/user')
const Transaction = require('../models/transaction')
const bcrypt = require('bcryptjs')

router.get('/', async (req, res) => {
	const user = await User.findById(req.user._id).select('-password')
	if (!user) return res.status(404).json({ error: 'User not found' })
	res.json({ user })
})

router.put('/initCapital', (req, res) => {
	const { _id: userId } = req.user
	const { initCapital } = req.body
	const errorMessage = {
		message: 'Updating initial capital failed',
		success: false
	}
	User.findById(userId, (err, user) => {
		if (err) return res.json(errorMessage)
		user.initCapital = Number(initCapital)
		user.save((err, user) => {
			if (err) return res.json(errorMessage)
			console.log('Inital capital updated')
			res.json({
				message: 'Initial capital updated',
				success: true,
				data: user.initCapital
			})
		})
	})
})

router.put('/password', async (req, res) => {
	const { _id: userId, password: currentPassword } = req.user
	const { password } = req.body
	const errorMessage = { message: 'Updating password failed', success: false }
	try {
		const match = await bcrypt.compare(password, currentPassword)
		if (match)
			return res.json({
				message: 'This is your current password',
				success: false
			})
	} catch (error) {
		console.log(error)
		return res.json(errorMessage)
	}
	if (password.length < 6)
		return res.json({
			message: 'Password should be at least 6 characters long',
			success: false
		})
	User.findById(userId, async (err, user) => {
		if (err) return res.json(errorMessage)
		try {
			const hashedPassword = await bcrypt.hash(password, 10)
			user.password = hashedPassword
			user.save((err, user) => {
				if (err) return res.json(errorMessage)
				console.log('Password updated')
				res.send({ message: 'Password updated', success: true })
			})
		} catch (error) {
			console.log(error)
			res.json(errorMessage)
		}
	})
})

router.post('/category', (req, res) => {
	let { type, category } = req.body
	category = category[0].toUpperCase() + category.slice(1)
	const { _id: userId } = req.user
	User.findById(userId, (err, user) => {
		if (err) return console.log(err)
		user.categories[type].push(category)
		user.save((err, user) => {
			if (err) return console.log(err)
			console.log('Category added')
			res.json(user.categories)
		})
	})
})

router.delete('/category', async (req, res) => {
	const { category, type } = req.query
	const { _id: userId, categories } = req.user
	categories[type] = categories[type].filter(item => item !== category)
	try {
		await User.findByIdAndUpdate(userId, { $set: { categories: categories } }, { useFindAndModify: false })
		const updatedTransactions = await Transaction.find({ category: category })
		await Transaction.updateMany({ category: category }, { $set: { category: 'Other' } })
		res.json({
			categories: categories,
			transactionIds: updatedTransactions.map(transaction => transaction._id)
		})
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
