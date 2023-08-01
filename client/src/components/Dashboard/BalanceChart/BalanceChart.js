import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import TransactionCalculator from '../../../utils/TransactionCalculator'
import useResizeObserver from '../../../hooks/useResizeObserver'
import { Bar } from 'react-chartjs-2'
import dayjs from 'dayjs'
import { titleOptions, commonOptions } from '../../../utils/chartOptions'
import { asEuros } from '../../../utils'
import { CustomColorScale } from '../../../utils/chartjsPlugins'
import './BalanceChart.css'

export default function MontlyTotalBarChart() {
	const transactions = useSelector(state => state.transactions.data)
	const chartRef = useRef(null)
	const calculator = new TransactionCalculator(transactions)
	const dataset = calculator.monthlyBalances({ months: 12 })
	const chartSize = useResizeObserver(chartRef)

	const fetchingTransactions = useSelector(state => state.transactions.fetching)
	const fetching = fetchingTransactions || chartSize == null

	return (
		<div id='balance-graph-container' className='dashboard-item balance-graph' ref={chartRef} style={{ position: 'relative', zIndex: 1 }}>
			{fetching && (
				<LoadingScreen
					style={{
						color: 'black',
						width: 60,
						height: 60,
						position: 'absolute',
						top: '50%',
						marginTop: -30
					}}
					classes='flex-center'
				/>
			)}
			{!fetching && Object.keys(dataset).length > 0 && (
				<div style={{ width: '100%', height: '100%' }}>
					<Bar
						data={{
							labels: dataset.map(obj => dayjs(obj.date).format('M/YYYY')),
							datasets: [
								{
									data: dataset.map(obj => obj.income - obj.expense),
									label: 'Balance'
								}
							]
						}}
						options={{
							...commonOptions(chartSize),
							scales: {
								y: {
									beginAtZero: true
								}
							},
							plugins: {
								title: titleOptions('Monthly balances'),
								tooltip: {
									callbacks: {
										label: context => {
											const dataPoint = dataset[context.dataIndex]
											const balance = context.dataset.data[context.dataIndex]
											const savingsRate = dataPoint.income > 0 ? (dataPoint.income - dataPoint.expense) / dataPoint.income : 0
											return [
												`Income: ${asEuros(dataPoint.income)}\n`,
												`Expenses: ${asEuros(dataPoint.expense)}\n`,
												`Balance: ${(balance >= 0 ? '+' : '') + asEuros(balance)}\n`,
												`Savings rate: ${savingsRate.toLocaleString('fi-FI', { style: 'percent', maximumFractionDigits: 1 })}`
											]
										}
									},
									displayColors: false
								}
							},
							layout: {
								padding: {
									left: 2
								}
							}
						}}
						plugins={[CustomColorScale]}
					/>
				</div>
			)}
			{!fetching && Object.keys(dataset).length === 0 && (
				<div className='flex-center blank-page'>
					<h2 style={{ fontFamily: 'Arial', fontSize: 22 }}>Not enough data</h2>
				</div>
			)}
		</div>
	)
}
