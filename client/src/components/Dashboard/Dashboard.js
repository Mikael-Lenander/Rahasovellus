import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NetWorth from './NetWorth/NetWorth'
import TransactionForm from './TransactionForm/TransactionForm'
import BalanceChart from './BalanceChart/BalanceChart'
import TransactionTable from './TransactionTable/TransactionTable'
import PieChart from './PieChart/PieChart'
import getTransactions from '../../actions/getTransactions'
import './Dashboard.css'
import { Chart as ChartJS, Title, Tooltip, CategoryScale, LinearScale, ArcElement, BarElement } from 'chart.js'

ChartJS.register(Title, Tooltip, CategoryScale, LinearScale, ArcElement, BarElement)

export default function Dashboard() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getTransactions())
	}, [dispatch])

	return (
		<main className='dashboard-grid'>
			<NetWorth />
			<TransactionForm />
			<BalanceChart />
			<TransactionTable />
			<PieChart className='monthly-income-graph dashboard-item' title='Income this month' type='income' />
			<PieChart className='monthly-expense-graph dashboard-item' title='Expenses this month' type='expense' />
		</main>
	)
}
