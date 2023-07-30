import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Shared/Header/Header'
import DatePicker from 'react-datepicker'
import NetWorthChart from './ChartComponents/NetWorthChart/NetWorthChart'
import LoadingScreen from '../Shared/LoadingScreen/LoadingScreen'
import TransactionCalculator from '../../utils/TransactionCalculator'
import dayjs from 'dayjs'
import './Charts.css'

const CHARTS = {
	NET_WORTH: 'Net worth',
}

export default function Charts() {
	const transactions = useSelector(state => state.transactions.data)
	const oldestTransactionDate = useSelector(state => state.user.data.oldestTransactionDate)
	const [chart, setChart] = useState(CHARTS.NET_WORTH)
	const [startDate, setStartDate] = useState(new Date(oldestTransactionDate))
	const [endDate, setEndDate] = useState(new Date())
	const [svgHeight, setSvgHeight] = useState(450)
	const datasetGenerator = new TransactionCalculator(transactions)

	function drawChart(chart) {
		const startDateString = startDate ? dayjs(startDate).format('YYYY/M/D') : dayjs(oldestTransactionDate).format('YYYY/M/D')
		const endDateString = endDate ? dayjs(endDate).format('YYYY/M/D') : dayjs(100000000000000).format('YYYY/M/D')
		switch (chart) {
			case CHARTS.NET_WORTH:
				const dataset = datasetGenerator.netWorths(startDateString, endDateString)
				return <NetWorthChart dataset={dataset} onSetSvgHeight={onSetSvgHeight} />
			default:
				throw new Error('Invalid chart type')
		}
	}

	function onSetSvgHeight(width, legendHeight) {
		if (width > 600) {
			setSvgHeight(375 + legendHeight)
		} else {
			setSvgHeight(225 + legendHeight)
		}
	}

	const fetchingTransactions = useSelector(state => state.transactions.fetching)
	const fetchingUser = useSelector(state => state.user.fetching)
	const fetching = fetchingTransactions || fetchingUser || chartSize == null

	return (
		<>
			<Header
				links={[{ path: '/charts', text: 'Charts' }, { path: '/dashboard', text: 'Dashboard' }, { path: '/profile', text: 'Profile' }, { logout: true }]}
			></Header>
			<main className='chart-container'>
				<form className='chart-form'>
					<div className='search-form-item'>
						<label htmlFor='from' style={{ margin: 0 }}>
							From
						</label>
						<DatePicker
							className='form-control text-input'
							dateFormat='dd/MM/yyyy'
							minDate={new Date(oldestTransactionDate)}
							selected={startDate}
							maxDate={endDate}
							onChange={date => setStartDate(date)}
						/>
					</div>
					<div className='search-form-item'>
						<label htmlFor='to' style={{ margin: 0 }}>
							To
						</label>
						<DatePicker
							className='form-control text-input'
							dateFormat='dd/MM/yyyy'
							selected={endDate}
							minDate={startDate}
							onChange={date => setEndDate(date)}
						/>
					</div>
					<div className='search-form-item wide-grid-item'>
						<label htmlFor='type' style={{ margin: 0 }}>
							Chart
						</label>
						<select className='form-control text-input' value={chart} onChange={e => setChart(e.target.value)}>
							{Object.values(CHARTS).map(chart => (
								<option key={chart} value={chart}>
									{chart}
								</option>
							))}
						</select>
					</div>
				</form>
				<div className='chart' style={{ height: svgHeight }} ref={chartRef}>
					{fetching ? (
						<LoadingScreen style={{ color: 'black', width: 60, height: 60 }} containerStyle={{ width: '100%', height: '100%' }} classes='flex-center' />
					) : (
						drawChart(chart)
					)}
				</div>
			</main>
		</>
	)
}
