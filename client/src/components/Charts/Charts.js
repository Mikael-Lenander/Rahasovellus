import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Shared/Header/Header'
import NetWorthChart from './ChartComponents/NetWorthChart'
import MonthlyBarChart from './ChartComponents/MonthlyBarChart'
import LoadingScreen from '../Shared/LoadingScreen/LoadingScreen'
import { useForm } from '../../hooks/useForm'
import { DateField, SelectField, CheckboxGroup } from '../Shared/Form/formFields'
import TransactionCalculator from '../../utils/TransactionCalculator'
import useResizeObserver from '../../hooks/useResizeObserver'
import dayjs from 'dayjs'
import './Charts.css'
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, TimeScale, PointElement, LineElement, Filler, BarElement } from 'chart.js'
import { CustomColorScale } from '../../utils/chartjsPlugins'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, TimeScale, PointElement, LineElement, Filler, BarElement, CustomColorScale)
ChartJS.defaults.color = 'black'

const CHARTS = {
	NET_WORTH: 'Net worth',
	MONTHLY_EXPENSES: 'Monthly expenses',
	MONTHLY_INCOME: 'Monthly income'
}
const CHECKBOXES = {
	[CHARTS.MONTHLY_EXPENSES]: 'expense',
	[CHARTS.MONTHLY_INCOME]: 'income'
}
export const COLORS = {
	RED: 'rgb(166, 70, 65)',
	GREEN: 'rgb(41, 133, 47)',
	LIGHT_GREEN: 'rgb(41, 133, 47, 0.5)',
	LIGHT_RED: 'rgb(166, 70, 65, 0.5)'
}

export default function Charts() {
	const transactions = useSelector(state => state.transactions.data)
	const { oldestTransactionDate, initCapital, categories } = useSelector(state => state.user.data)
	const chartRef = useRef()
	const chartSize = useResizeObserver(chartRef)
	const datasetGenerator = new TransactionCalculator(transactions, initCapital)
	const { state, setInput, setCheckboxGroup } = useForm({
		startDate: new Date(oldestTransactionDate),
		endDate: new Date(),
		chart: CHARTS.NET_WORTH,
		categories: []
	})

	useEffect(() => {
		if (CHECKBOXES[state.chart]) {
			setInput('categories', categories[CHECKBOXES[state.chart]].map(category => ({ name: category, checked: true })))
		} else {
			setInput('categories', [])
		}
	}, [state.chart, categories, setInput])

	function drawChart() {
		const { startDate, endDate, chart } = state
		console.log('state', state)
		const startDateString = startDate ? dayjs(startDate).format('YYYY/M/D') : dayjs(oldestTransactionDate).format('YYYY/M/D')
		const endDateString = endDate ? dayjs(endDate).format('YYYY/M/D') : dayjs(100000000000000).format('YYYY/M/D')
		const excludedCategories = state.categories.filter(category => !category.checked).map(category => category.name)
		let dataset
		let maxBalance
		switch (chart) {
			case CHARTS.NET_WORTH:
				dataset = datasetGenerator.netWorths(startDateString, endDateString)
				return <NetWorthChart dataset={dataset} size={chartSize} />
			case CHARTS.MONTHLY_EXPENSES:
				maxBalance = datasetGenerator.maxMonthlyBalances({ startDate: startDateString, endDate: endDateString }).expense
				dataset = datasetGenerator.monthlyBalances({ startDate: startDateString, endDate: endDateString, excludedCategories })
				return <MonthlyBarChart dataset={dataset} size={chartSize} title='Monthly Expenses' type='expense' color={COLORS.RED} yMax={maxBalance} />
			case CHARTS.MONTHLY_INCOME:
				maxBalance = datasetGenerator.maxMonthlyBalances({ startDate: startDateString, endDate: endDateString }).income
				dataset = datasetGenerator.monthlyBalances({ startDate: startDateString, endDate: endDateString, excludedCategories })
				return <MonthlyBarChart dataset={dataset} size={chartSize} title='Monthly Income' type='income' color={COLORS.GREEN} yMax={maxBalance} />
			default:
				throw new Error('Invalid chart type')
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
				<form>
					<Container>
						<Row className='chart-row'>
							<Col className='chart-form-item' lg={4} md={6}>
								<label htmlFor='startDate' style={{ margin: 0 }}>
									From
								</label>
								<DateField id='startDate' minDate={new Date(oldestTransactionDate)} maxDate={state.endDate} value={state.startDate} onChange={setInput} />
							</Col>
							<Col className='chart-form-item' lg={4} md={6}>
								<label htmlFor='endDate' style={{ margin: 0 }}>
									To
								</label>
								<DateField id='endDate' minDate={state.startDate} value={state.endDate} onChange={setInput} />
							</Col>
							<Col className='chart-form-item' lg={4} md={12}>
								<label htmlFor='type' style={{ margin: 0 }}>
									Chart
								</label>
								<SelectField id='chart' values={Object.values(CHARTS)} value={state.chart} onChange={setInput} />
							</Col>
						</Row>
						{state.categories.length > 0 && (
										<Row className='chart-row'>
											<Col className='chart-form-item'>
												<CheckboxGroup id='categories' values={state.categories} onChange={setCheckboxGroup} />
											</Col>
										</Row>
									)}
					</Container>
				</form>
				<div className='chart' ref={chartRef}>
					{fetching ? (
						<LoadingScreen style={{ color: 'black', width: 60, height: 60 }} containerStyle={{ width: '100%', height: '100%' }} classes='flex-center' />
					) : (
						drawChart()
					)}
				</div>
			</main>
		</>
	)
}
