import React from 'react'
import { useSelector } from 'react-redux'
import transactionCalculator from '../../../utils/transactionCalculator'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import './NetWorth.css'

export default function NetWorth() {
	const transactions = useSelector(state => state.transactions.data)
	const initCapital = useSelector(state => state.user.data.initCapital)
	console.log('transactions', transactions)
	const calculator = new transactionCalculator(transactions, initCapital)
	const netWorth = calculator.netWorth()
	const lastMonthDifference = calculator.netWorth(1)
	const lastThreeMonthsDifference = calculator.netWorth(3)
	const differenceColor = num => (num >= 0 ? 'green' : 'red')
	const formattedNumber = num => (num < 0 ? '' : '+') + num.toFixed(2)

	const fetching = useSelector(state => state.transactions.fetching)

	return (
		<>
			{fetching ? (
				<LoadingScreen style={{ color: 'black' }} size='3x' classes='flex-center dashboard-item' />
			) : (
				<div className='net-worth dashboard-item'>
					<h2>Net worth</h2>
					<hr />
					<h1>{Math.round(netWorth)}€</h1>
					<p>
						30-day:
						<span style={{ color: differenceColor(lastMonthDifference) }}>{formattedNumber(lastMonthDifference)}€</span>
						90-day:
						<span style={{ color: differenceColor(lastThreeMonthsDifference) }}>{formattedNumber(lastThreeMonthsDifference)}€</span>
					</p>
				</div>
			)}
		</>
	)
}
