const dayjs = require('dayjs')

class datasetGenerator {
	constructor(data, initCapital = 0, categories = []) {
		this.data = data
		this.initCapital = initCapital
		this.categories = categories
	}

	initCapitalAt(date) {
		return this.data
			.filter(transaction => new Date(transaction.date) < new Date(date))
			.reduce((sum, transaction) => {
				const multiplier = transaction.type == 'income' ? 1 : -1
				return sum + multiplier * transaction.amount
			}, this.initCapital)
	}

	netWorth(startDate) {
		const initCapital = this.initCapitalAt(startDate)
		return this.data
			.filter(transaction => new Date(transaction.date) >= new Date(startDate))
			.reduce(
				(arr, transaction) => {
					const multiplier = transaction.type === 'income' ? 1 : -1
					const currentDate = dayjs(transaction.date)
					const lastDate = dayjs(arr[arr.length - 1].date)
					if (currentDate.isSame(lastDate, 'day')) {
						arr[arr.length - 1].capital += multiplier * transaction.amount
						return arr
					}
					arr.push({
						date: new Date(transaction.date),
						capital: arr[arr.length - 1].capital + multiplier * transaction.amount,
					})
					return arr
				},
				[
					{
						date: new Date(startDate),
						capital: initCapital,
					},
				]
			)
	}

	distributionAt(date) {
		const initObj = this.categories.reduce((obj, category) => {
			obj[category] = 0
			return obj
		}, {})
		return this.data
			.filter(transaction => new Date(transaction.date) < new Date(date))
			.reduce(
				(obj, transaction) => {
					obj[transaction.category] += transaction.amount
					return obj
				},
				{ date: new Date(date), ...initObj }
			)
	}

	distribution(startDate) {
		const initDistribution = this.distributionAt(startDate)
		return this.data
			.filter(transaction => new Date(transaction.date) >= new Date(startDate))
			.reduce(
				(arr, transaction) => {
					const currentDate = dayjs(transaction.date)
					const lastDate = dayjs(arr[arr.length - 1].date)
					if (currentDate.isSame(lastDate, 'day')) {
						arr[arr.length - 1][transaction.category] += transaction.amount
						return arr
					}
					const lastObj = Object.assign(arr[arr.length - 1])
					lastObj[transaction.category] += transaction.amount
					arr.push({
						...lastObj,
						date: new Date(transaction.date),
					})
					return arr
				},
				[initDistribution]
			)
	}
}

module.exports = datasetGenerator
// const dataset = [
//     {
//       "_id": "609a5b3519b0d60958b6c7ef",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Other",
//       "amount": 1107.8,
//       "date": "2020-01-16T22:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c7fd",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Salary",
//       "amount": 533.3399999999999,
//       "date": "2020-02-13T22:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c7fc",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Benefits",
//       "amount": 600.19,
//       "date": "2020-02-21T22:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c809",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 515.9200000000001,
//       "date": "2020-03-08T22:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c808",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 788.27,
//       "date": "2020-03-24T22:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c815",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 612.06,
//       "date": "2020-04-07T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c814",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Investments",
//       "amount": 402.6,
//       "date": "2020-04-22T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c821",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 300.54,
//       "date": "2020-05-03T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c820",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Investments",
//       "amount": 491.1,
//       "date": "2020-05-14T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//         "_id": "609a5b3519b0d60958b6c820",
//         "userId": "6097c9bcd4e80e0afcc4665b",
//         "type": "income",
//         "category": "Benefits",
//         "amount": 10,
//         "date": "2020-06-01T22:00:00.000Z",
//         "comment": "",
//         "__v": 0
//       },
//     {
//       "_id": "609a5b3519b0d60958b6c82c",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Salary",
//       "amount": 513.9100000000001,
//       "date": "2020-06-15T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//         "_id": "609a5b3519b0d60958b6c82c",
//         "userId": "6097c9bcd4e80e0afcc4665b",
//         "type": "income",
//         "category": "Other",
//         "amount": 100,
//         "date": "2020-06-15T22:00:00.000Z",
//         "comment": "",
//         "__v": 0
//       },
//     {
//       "_id": "609a5b3519b0d60958b6c82b",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Salary",
//       "amount": 630.27,
//       "date": "2020-06-24T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c837",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 567.6600000000001,
//       "date": "2020-07-15T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c838",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Other",
//       "amount": 506.88,
//       "date": "2020-07-23T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c844",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Benefits",
//       "amount": 827.6,
//       "date": "2020-08-05T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c845",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Gifts",
//       "amount": 944.18,
//       "date": "2020-08-20T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c851",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Salary",
//       "amount": 643.44,
//       "date": "2020-09-09T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c850",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Benefits",
//       "amount": 1193.73,
//       "date": "2020-09-12T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c85d",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Other",
//       "amount": 560.77,
//       "date": "2020-10-01T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     },
//     {
//       "_id": "609a5b3519b0d60958b6c85c",
//       "userId": "6097c9bcd4e80e0afcc4665b",
//       "type": "income",
//       "category": "Other",
//       "amount": 296.33,
//       "date": "2020-10-15T21:00:00.000Z",
//       "comment": "",
//       "__v": 0
//     }
//   ]
// const generator = new datasetGenerator(dataset, 0, ['Salary', 'Benefits', 'Investments', 'Gifts', 'Other'])
// console.log(generator.distribution('2020/6/1').map(obj => obj.date))
