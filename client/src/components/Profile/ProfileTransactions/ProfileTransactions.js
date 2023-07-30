import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import './ProfileTransactions.css'
import TransactionSearchTable from './TransactionSearchTable/TransactionSearchTable'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'

export default function ProfileTransactions() {
	const transactions = useSelector(state => state.transactions.data)
	let categoryTypes = useSelector(state => state.user.data.categories)
	categoryTypes = {
		income: ['Any', ...categoryTypes.income],
		expense: ['Any', ...categoryTypes.expense]
	}
	const [selectedCategoryType, setSelectedCategoryType] = useState('any')
	const [categories, setCategories] = useState(['Any'])
	const [category, setCategory] = useState(categories[0])
	const [minDate, setMinDate] = useState()
	const [maxDate, setMaxDate] = useState()
	const [minAmount, setMinAmount] = useState(0)
	const [maxAmount, setMaxAmount] = useState('')

	function search({ minAmount = 0, maxAmount = Infinity, minDate = -Infinity, maxDate = Infinity, type = 'any', category = 'Any' }) {
		const filteredTransactions = transactions.filter(transaction => {
			if (new Date(transaction.date) < new Date(minDate) || new Date(transaction.date) >= dayjs(maxDate).add(1, 'day')) {
				return false
			} else if (transaction.amount < minAmount || transaction.amount > maxAmount) {
				return false
			} else if (type !== 'any' && transaction.type !== type) {
				return false
			} else if (category !== 'Any' && transaction.category !== category) {
				return false
			}
			return true
		})
		return filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
	}

	function onChangeDropDown(event) {
		const value = event.target.value
		setSelectedCategoryType(value)
		setCategories(value === 'income' ? categoryTypes.income : value === 'expense' ? categoryTypes.expense : ['Any'])
		setCategory(value === 'income' ? categoryTypes.income[0] : value === 'expense' ? categoryTypes.expense[0] : 'Any')
	}

	return (
		<div className='profile-section profile-transactions'>
			<div className='transaction-search'>
				<h1 className='title'>Search for transactions</h1>
				<form>
					<div className='search-form'>
						<div className='search-form-item'>
							<label htmlFor='min-amount' style={{ margin: 0 }}>
								Min amount
							</label>
							<input
								id='min-amount'
								type='number'
								className='form-control text-input'
								min='0'
								step='0.01'
								value={minAmount}
								onChange={e => setMinAmount(e.target.value)}
							/>
						</div>
						<div className='search-form-item'>
							<label htmlFor='max-amount' style={{ margin: 0 }}>
								Max amount
							</label>
							<input
								id='max-amount'
								type='number'
								className='form-control text-input'
								min={minAmount.toString()}
								step='0.01'
								value={maxAmount}
								onChange={e => setMaxAmount(e.target.value)}
							/>
						</div>
						<div className='search-form-item'>
							<label htmlFor='from' style={{ margin: 0 }}>
								From
							</label>
							<DatePicker
								className='form-control text-input'
								selected={minDate}
								onChange={date => setMinDate(date)}
								dateFormat='dd/MM/yyyy'
								maxDate={maxDate}
							/>
						</div>
						<div className='search-form-item'>
							<label htmlFor='to' style={{ margin: 0 }}>
								To
							</label>
							<DatePicker
								className='form-control text-input'
								selected={maxDate}
								onChange={date => setMaxDate(date)}
								dateFormat='dd/MM/yyyy'
								minDate={minDate}
							/>
						</div>
						<div className='search-form-item'>
							<label htmlFor='type' style={{ margin: 0 }}>
								Type
							</label>
							<select className='form-control text-input' value={selectedCategoryType} onChange={onChangeDropDown}>
								<option value='any'>Any</option>
								<option value='income'>Income</option>
								<option value='expense'>Expense</option>
							</select>
						</div>
						<div className='search-form-item'>
							<label htmlFor='category' style={{ margin: 0 }}>
								Category
							</label>
							<select className='form-control text-input' value={category} onChange={e => setCategory(e.target.value)}>
								{categories.map(item => (
									<option key={item} value={item}>
										{item}
									</option>
								))}
							</select>
						</div>
					</div>
				</form>
			</div>
			<TransactionSearchTable
				transactions={search({
					minAmount: minAmount || -Infinity,
					maxAmount: maxAmount || Infinity,
					minDate: minDate,
					maxDate: maxDate,
					type: selectedCategoryType,
					category: category
				})}
			/>
		</div>
	)
}
