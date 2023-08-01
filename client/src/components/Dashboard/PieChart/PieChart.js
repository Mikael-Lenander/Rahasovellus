import React, { useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { titleOptions, tooltipOptions, commonOptions } from '../../../utils/chartOptions'
import useResizeObserver from '../../../hooks/useResizeObserver'
import TransactionCalculator from '../../../utils/TransactionCalculator'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import { asEuros } from '../../../utils'
import { Legend } from 'chart.js'
import './PieChart.css'

const colors = [
	{ r: 225, g: 87, b: 89 },
	{ r: 78, g: 121, b: 167 },
	{ r: 242, g: 142, b: 44 },
	{ r: 118, g: 183, b: 178 },
	{ r: 89, g: 161, b: 79 },
	{ r: 237, g: 201, b: 73 },
	{ r: 175, g: 122, b: 161 },
	{ r: 255, g: 157, b: 167 },
	{ r: 156, g: 117, b: 95 },
	{ r: 186, g: 176, b: 171 }
]

export default function PieChart({ className, title, type }) {
	const transactions = useSelector(state => state.transactions.data)
	const calculator = new TransactionCalculator(transactions)
	const dataset = calculator.monthlyCategories(type)
	const sums = calculator.monthlyBalances({ months: 1 })[0] || { income: 0, expense: 0 }
	const total = sums[type]
	const chartRef = useRef()
	const chartSize = useResizeObserver(chartRef)
	const fetchingTransactions = useSelector(state => state.transactions.fetching)
	const fetching = fetchingTransactions || chartSize == null

	return (
		<div className={className} ref={chartRef} style={{ position: 'relative', zIndex: 1 }}>
			{fetching && (
				<LoadingScreen
					style={{
						color: 'black',
						width: 50,
						height: 50,
						position: 'absolute',
						top: '50%',
						marginTop: -25
					}}
					classes='flex-center'
				/>
			)}
			{!fetching && Object.keys(dataset).length > 0 && (
				<div style={{ height: '100%', width: '100%' }}>
					<Doughnut
						data={{
							labels: dataset.map(obj => obj.category),
							datasets: [
								{
									label: 'Amount',
									data: dataset.map(obj => obj.amount),
									backgroundColor: colors.map(color => `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`),
									borderColor: colors.map(color => `rgba(${color.r}, ${color.g}, ${color.b}, 1)`),
									borderWidth: 1
								}
							]
						}}
						options={{
							...commonOptions(chartSize),
							layout: {
								padding: {
									bottom: 5
								}
							},
							plugins: {
								title: titleOptions(title),
								tooltip: tooltipOptions
							}
						}}
						plugins={[
							Legend,
							{
								afterDatasetsDraw(chart, args, options) {
									const { ctx, chartArea } = chart
									const { x, y } = chart.getDatasetMeta(0).data[0]
									const radius = Math.min(chartArea.width, chartArea.height) / 2
									const fontSize = Math.max(0.15 * radius, 13)
									ctx.font = `bold ${fontSize}px Arial`
									ctx.textAlign = 'center'
									ctx.fillText(asEuros(total), x, y)
								}
							}
						]}
					/>
				</div>
			)}
			{!fetching && dataset.length === 0 && (
				<div className='flex-center blank-page'>
					<h2 style={{ fontFamily: 'Arial', fontSize: 22 }}>Not enough data</h2>
				</div>
			)}
		</div>
	)
}
