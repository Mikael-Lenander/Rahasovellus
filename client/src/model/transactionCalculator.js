import dayjs from 'dayjs'

export default class transactionCalculator {
    constructor(data, initCapital=0) {
        this.data = data
        this.initCapital = initCapital
    }

    getMonth(year, month) {
        return this.data.filter(obj => new Date(year, month - 1) <= new Date(obj.date) && new Date(obj.date) < new Date(year, month))
    }

    monthlyCategories(type) {
        const currentYearAndMonth = [dayjs().year(), dayjs().month() + 1]
        // const currentYearAndMonth = [2021, 5]
        return this.getMonth(...currentYearAndMonth).filter(transaction => transaction.type === type)
        .reduce((obj, transaction) => {
            if (!obj.hasOwnProperty(transaction.category)) obj[transaction.category] = 0
            obj[transaction.category] += transaction.amount
            return obj
        }, {})
    }

    monthlyBalance(months) {
        const startDate = dayjs().subtract(months - 1, 'month')
        const year = startDate.year()
        const month = startDate.month() + 1
        return Array(months).fill().map((_, idx) => this.getMonth(year, month + idx).reduce((obj, transaction) => {
            if (!obj.hasOwnProperty('date')) {
                obj.date = `${dayjs(transaction.date).year()}/${dayjs(transaction.date).month() + 1}/1`
                obj.expences = 0
                obj.income = 0
            }
            if (transaction.type === 'income') obj.income += transaction.amount
            else obj.expences += transaction.amount
            return obj
        }, {}))
        .filter(obj => Object.keys(obj).length > 0)
    }

    netWorth(months=null) {
        const currentDate = new Date()
        const comparisonDate = months ? dayjs().subtract(months, 'month') : new Date(0)
        const initCapital = !months ? this.initCapital : 0
        return initCapital + this.data.filter(obj => comparisonDate <= new Date(obj.date) && new Date(obj.date) <= currentDate)
        .reduce((sum, transaction) => {
            if (transaction.type === 'income') return sum + transaction.amount
            return sum - transaction.amount
        }, 0)
    }

    numberOfTransactions(category) {
        return this.data.reduce((sum, transaction) => {
            if (transaction.category === category) return sum + 1
            return sum
        }, 0)
    }
}