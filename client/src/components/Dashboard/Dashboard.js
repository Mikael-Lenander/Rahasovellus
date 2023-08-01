import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NetWorth from './NetWorth/NetWorth'
import TransactionForm from './TransactionForm/TransactionForm'
import BalanceGraph from './BalanceGraph/BalanceGraph'
import TransactionTable from './TransactionTable/TransactionTable'
import PieChart from './PieChart/PieChart'
import getTransactions from '../../actions/getTransactions'
import './Dashboard.css'

export default function Dashboard() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getTransactions())
	}, [dispatch])

	return (
		<main className='dashboard-grid'>
			<NetWorth />
			<TransactionForm />
			<BalanceGraph />
			<TransactionTable />
			<PieChart className='monthly-income-graph dashboard-item' title='Income this month' type='income' />
			<PieChart className='monthly-expense-graph dashboard-item' title='Expenses this month' type='expense' />
		</main>
	)
}
