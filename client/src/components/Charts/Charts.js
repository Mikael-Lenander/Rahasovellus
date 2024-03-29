import React, { useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import NetWorthChart from './ChartComponents/NetWorthChart'
import MontlyTotalBarChart from './ChartComponents/MonthlyTotalBarChart'
import CategoryBarChart from './ChartComponents/CategoryBarChart'
import LoadingScreen from '../Shared/LoadingScreen/LoadingScreen'
import { useForm } from '../../hooks/useForm'
import { DateField, SelectField, CheckboxGroup } from '../Shared/Form/formFields'
import TransactionCalculator from '../../utils/TransactionCalculator'
import useResizeObserver from '../../hooks/useResizeObserver'
import dayjs from 'dayjs'
import './Charts.css'
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Title, Tooltip, PointElement, LineElement, Filler, BarElement } from 'chart.js'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { CHART_COLORS } from '../../utils/chartOptions'

ChartJS.register(CategoryScale, LinearScale, TimeScale, Title, Tooltip, PointElement, LineElement, Filler, BarElement)
ChartJS.defaults.color = 'black'

const CHARTS = {
	NET_WORTH: 'Net worth',
	MONTHLY_EXPENSES: 'Monthly expenses',
	MONTHLY_INCOME: 'Monthly income',
	INCOME_MEANS: 'Mean monthly income',
	EXPENSE_MEANS: 'Mean monthly expences'
}
const dateModes = {
	[CHARTS.NET_WORTH]: 'day',
	[CHARTS.MONTHLY_EXPENSES]: 'month',
	[CHARTS.MONTHLY_INCOME]: 'month',
	[CHARTS.INCOME_MEANS]: 'month',
	[CHARTS.EXPENSE_MEANS]: 'month'
}
const showTotalCheckbox = [{ name: 'Show total', checked: false }]

export default function Charts() {
	const transactions = useSelector(state => state.transactions.data)
	const { oldestTransactionDate, initCapital, categories } = useSelector(state => state.user.data)
	const chartRef = useRef()
	const chartSize = useResizeObserver(chartRef)
	const datasetGenerator = new TransactionCalculator(transactions, initCapital)
	const { state, setInput, setCheckboxGroup } = useForm({
		startDate: new Date(oldestTransactionDate),
		endDate: Math.max(new Date(), new Date(oldestTransactionDate)),
		chart: CHARTS.NET_WORTH,
		options: []
	})
	const checkboxes = useMemo(
		() => ({
			[CHARTS.MONTHLY_EXPENSES]: intitialCheckboxes(categories.expense),
			[CHARTS.MONTHLY_INCOME]: intitialCheckboxes(categories.income),
			[CHARTS.INCOME_MEANS]: showTotalCheckbox,
			[CHARTS.EXPENSE_MEANS]: showTotalCheckbox
		}),
		[categories]
	)

	useEffect(() => {
		if (checkboxes[state.chart] != null) {
			setInput('options', checkboxes[state.chart])
		}
	}, [state.chart, categories, setInput, checkboxes])

	function intitialCheckboxes(categories) {
		return categories.map(category => ({ name: category, checked: true }))
	}

	function drawChart() {
		const { startDate, endDate, chart } = state
		const startDateString = startDate ? dayjs(startDate).format('YYYY/M/D') : dayjs(oldestTransactionDate).format('YYYY/M/D')
		const endDateString = endDate ? dayjs(endDate).format('YYYY/M/D') : dayjs(100000000000000).format('YYYY/M/D')
		let excludedCategories, showTotal, dataset, maxBalance
		switch (chart) {
			case CHARTS.NET_WORTH:
				dataset = datasetGenerator.netWorths(startDateString, endDateString)
				return <NetWorthChart dataset={dataset} size={chartSize} />
			case CHARTS.MONTHLY_EXPENSES:
				excludedCategories = state.options.filter(option => !option.checked).map(option => option.name)
				maxBalance = datasetGenerator.maxMonthlyBalances({ startDate: startDateString, endDate: endDateString, wholeRange: true }).expense
				dataset = datasetGenerator.monthlyBalances({ startDate: startDateString, endDate: endDateString, excludedCategories: excludedCategories })
				return <MontlyTotalBarChart dataset={dataset} size={chartSize} title='Monthly Expenses' type='expense' color={CHART_COLORS.RED} yMax={maxBalance} />
			case CHARTS.MONTHLY_INCOME:
				excludedCategories = state.options.filter(option => !option.checked).map(option => option.name)
				maxBalance = datasetGenerator.maxMonthlyBalances({ startDate: startDateString, endDate: endDateString, wholeRange: true }).income
				dataset = datasetGenerator.monthlyBalances({ startDate: startDateString, endDate: endDateString, excludedCategories: excludedCategories })
				return <MontlyTotalBarChart dataset={dataset} size={chartSize} title='Monthly Income' type='income' color={CHART_COLORS.GREEN} yMax={maxBalance} />
			case CHARTS.INCOME_MEANS:
				showTotal = state.options.find(option => option.name === 'Show total')?.checked
				dataset = datasetGenerator.means(startDateString, endDateString, 'income')
				return <CategoryBarChart dataset={dataset} size={chartSize} title='Mean monthly income' color={CHART_COLORS.GREEN} showTotal={showTotal} />
			case CHARTS.EXPENSE_MEANS:
				showTotal = state.options.find(option => option.name === 'Show total')?.checked
				dataset = datasetGenerator.means(startDateString, endDateString, 'expense')
				return <CategoryBarChart dataset={dataset} size={chartSize} title='Mean monthly expences' color={CHART_COLORS.RED} showTotal={showTotal} />
			default:
				throw new Error('Invalid chart type')
		}
	}

	const fetchingTransactions = useSelector(state => state.transactions.fetching)
	const fetchingUser = useSelector(state => state.user.fetching)
	const fetching = fetchingTransactions || fetchingUser || chartSize == null
	return (
		<main className='chart-container'>
			<form>
				<Container>
					<Row className='chart-row'>
						<Col className='chart-form-item' lg={4} md={6}>
							<label htmlFor='startDate' className='form-label'>
								From
							</label>
							<DateField
								id='startDate'
								minDate={new Date(oldestTransactionDate)}
								maxDate={state.endDate}
								value={state.startDate}
								mode={dateModes[state.chart]}
								onChange={setInput}
							/>
						</Col>
						<Col className='chart-form-item' lg={4} md={6}>
							<label htmlFor='endDate' className='form-label'>
								To
							</label>
							<DateField id='endDate' minDate={state.startDate} value={state.endDate} mode={dateModes[state.chart]} onChange={setInput} />
						</Col>
						<Col className='chart-form-item' lg={4} md={12}>
							<label htmlFor='type' className='form-label'>
								Chart
							</label>
							<SelectField id='chart' values={Object.values(CHARTS)} value={state.chart} onChange={setInput} />
						</Col>
					</Row>
					{state.options.length > 0 && (
						<Row className='chart-row'>
							<Col className='chart-form-item'>
								<CheckboxGroup id='options' values={state.options} onChange={setCheckboxGroup} />
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
	)
}
