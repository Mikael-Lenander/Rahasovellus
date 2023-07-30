import dayjs from 'dayjs'
import { sortedByDate } from './index'

export default class TransactionCalculator {
	constructor(transactions, initCapital = 0) {
		this.transactions = transactions
		this.initCapital = initCapital
	}

	monthlyCategories(type) {
		const currentMonth = dayjs().startOf('month')
		return this.transactions.reduce((obj, transaction) => {
			if (transaction.type !== type) return obj
			if (!currentMonth.isSame(dayjs(transaction.date), 'month')) return obj
			if (!obj.hasOwnProperty(transaction.category)) obj[transaction.category] = 0
			obj[transaction.category] += transaction.amount
			return obj
		}, {})
	}

	monthlyBalances({ startDate, endDate, months }) {
		if (months) {
			startDate = dayjs().subtract(months, 'month')
			endDate = dayjs()
		}
		const balances = this.transactions.reduce((obj, transaction) => {
			const date = dayjs(transaction.date).startOf('month')
			const dateString = date.format('M/YYYY')
			if (date.isBefore(startDate, 'month') || date.isAfter(endDate, 'month')) return obj
			if (!(dateString in obj)) {
				obj[dateString] = { date, income: 0, expense: 0 }
			}
			obj[dateString][transaction.type] += transaction.amount
			return obj
		}, {})
		return sortedByDate(Object.values(balances))
	}

	netWorth(months = null) {
		const currentDate = new Date()
		const comparisonDate = months ? dayjs().subtract(months, 'month') : new Date(0)
		const initCapital = !months ? this.initCapital : 0
		return (
			initCapital +
			this.transactions
				.filter(obj => comparisonDate <= new Date(obj.date) && new Date(obj.date) <= currentDate)
				.reduce((sum, transaction) => {
					return sum + amount(transaction)
				}, 0)
		)
	}

	netWorths(startDate, endDate) {
		const initCapital = this.initCapitalAt(startDate)
		console.log('init capital', this.initCapital)
		return sortedByDate(this.transactions).reduce(
			(arr, transaction) => {
				const currentDate = dayjs(transaction.date)
				if (currentDate.isBefore(startDate, 'day') || currentDate.isAfter(endDate, 'day')) return arr
				const lastDate = dayjs(arr[arr.length - 1].date)
				if (currentDate.isSame(lastDate, 'day')) {
					arr[arr.length - 1].capital += amount(transaction)
					return arr
				}
				return arr.concat({
					date: dayjs(transaction.date).startOf('day').toString(),
					capital: arr[arr.length - 1].capital + amount(transaction)
				})
			},
			[
				{
					date: new Date(startDate),
					capital: initCapital
				}
			]
		)
	}

	initCapitalAt(date) {
		return this.transactions.reduce((sum, transaction) => {
			const isBeforeDateMultiplier = dayjs(transaction.date).isBefore(date, 'day') ? 1 : 0
			const multiplier = transaction.type === 'income' ? 1 : -1
			return sum + multiplier * transaction.amount * isBeforeDateMultiplier
		}, this.initCapital)
	}

	numberOfTransactions(category) {
		return this.transactions.reduce((sum, transaction) => {
			if (transaction.category === category) return sum + 1
			return sum
		}, 0)
	}
}

function amount(transaction) {
	return transaction.amount * (transaction.type === 'income' ? 1 : -1)
}
