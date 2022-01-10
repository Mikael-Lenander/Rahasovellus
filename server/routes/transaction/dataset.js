const Transaction = require('../../models/transaction')
const router = require('express').Router()
const dayjs = require('dayjs')
const datasetGenerator = require('../../models/datasetGenerator')

router.get('/net-worth', (req, res) => {
    let {startDate, endDate} = req.query
    const {_id: userId, initCapital} = req.user/* {_id: '6097c9bcd4e80e0afcc4665b', initCapital: 5000} */
    Transaction.find({
        userId: userId,
        date: {$lt: dayjs(endDate).add(1, 'day')}
    })
    .sort({date: 1})
    .exec((err, data) => {
        if (err) return console.log(err)
        const generator = new datasetGenerator(data, initCapital)
        res.json(generator.netWorth(startDate))
    })
})

function getDistribution(type, req, res) {
    const {startDate, endDate} = req.query
    const {_id: userId, categories} = req.user
    // {_id: '6097c9bcd4e80e0afcc4665b', initCapital: 5000, categories: {income: ['Salary', 'Benefits', 'Investments', 'Gifts', 'Other']}}
    Transaction.find({
        userId: userId,
        date: {$lt: dayjs(endDate).add(1, 'day')},
        type: type
    })
    .sort({date: 1})
    .exec((err, data) => {
        if (err) return console.log(err)
        const generator = new datasetGenerator(data, 0, categories[type])
        res.json(generator.distribution(startDate))
    })
}

router.get('/income-distribution', (req, res) => {
    const type = 'income'
    getDistribution(type, req, res)
})

router.get('/expense-distribution', (req, res) => {
    const type = 'expense'
    getDistribution(type, req, res)
})

module.exports = router



