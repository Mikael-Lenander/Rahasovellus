import React, { useEffect, useTransition, useMemo } from 'react'
import { useSelector } from 'react-redux'
import './ProfileTransactions.css'
import TransactionSearchTable from './TransactionSearchTable/TransactionSearchTable'
import dayjs from 'dayjs'
import { useForm } from '../../../hooks/useForm'
import { Field, SelectField, DateField } from '../../Shared/Form/formFields'

export default function ProfileTransactions() {
	const transactions = useSelector(state => state.transactions.data)
	const categoryTypes = useSelector(state => state.user.data.categories)
	const [isPending, startTransition] = useTransition()
	const { setInput, state } = useForm({
		categoryType: 'any',
		category: 'any',
		minAmount: 0,
		maxAmount: '',
		minDate: '',
		maxDate: new Date(),
		transactions: transactions
	})
	const categories = useMemo(() => {
		const categoryTypesWithAny = {
			any: ['any'],
			income: ['any', ...categoryTypes.income],
			expense: ['any', ...categoryTypes.expense]
		}
		return categoryTypesWithAny[state.categoryType]
	}, [state.categoryType, categoryTypes])

	function search({ id, value }={}) {
		const defaults = {
			minAmount: 0,
			maxAmount: Infinity,
			minDate: new Date(0),
			maxDate: new Date(8640000000000000),
			categoryType: 'any',
			category: 'any'
		}
		const values = { ...state, [id]: value }
		for (const key in values) {
			if (values[key] === '' || values[key] == null) {
				values[key] = defaults[key]
			}
			if (id === 'categoryType') {
				values.category = categories[0]
			}
		}
		const { minAmount, maxAmount, minDate, maxDate, categoryType, category } = values
		const filteredTransactions = transactions.filter(transaction => {
			if (dayjs(transaction.date).isBefore(minDate, 'day') || dayjs(transaction.date).isAfter(maxDate, 'day')) {
				return false
			} else if (transaction.amount < minAmount || transaction.amount > maxAmount) {
				return false
			} else if (categoryType !== 'any' && transaction.type !== categoryType) {
				return false
			} else if (category !== 'any' && transaction.category !== category) {
				return false
			}
			return true
		})
		return filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
	}

	function onChange(id, value) {
		setInput(id, value)
		startTransition(() => {
			setInput('transactions', search({ id, value }))
		})
	}

	useEffect(() => {
		setInput('category', categories[0])
	}, [state.categoryType, categories, setInput])

	useEffect(() => {
		startTransition(() => {
			setInput('transactions', search())
		})
	}, [transactions, setInput]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className='profile-section profile-transactions'>
			<div className='transaction-search'>
				<h1 className='title'>Search for transactions</h1>
				<form>
					<div className='search-form'>
						<div className='search-form-item'>
							<label htmlFor='minAmount' style={{ margin: 0 }}>
								Min amount
							</label>
							<Field id='minAmount' type='number' min={0} step='0.01' value={state.minAmount} onChange={onChange} />
						</div>
						<div className='search-form-item'>
							<label htmlFor='maxAmount' style={{ margin: 0 }}>
								Max amount
							</label>
							<Field id='maxAmount' type='number' min={state.minAmount} step='0.01' value={state.maxAmount} onChange={onChange} />
						</div>
						<div className='search-form-item'>
							<label htmlFor='minDate' style={{ margin: 0 }}>
								From
							</label>
							<DateField id='minDate' value={state.minDate} max={state.maxDate} onChange={onChange} />
						</div>
						<div className='search-form-item'>
							<label htmlFor='maxDate' style={{ margin: 0 }}>
								To
							</label>
							<DateField id='maxDate' value={state.maxDate} min={state.minDate} onChange={onChange} />
						</div>
						<div className='search-form-item'>
							<label htmlFor='categoryType' style={{ margin: 0 }}>
								Type
							</label>
							<SelectField id='categoryType' value={state.categoryType} onChange={onChange} values={['any', 'income', 'expense']} />
						</div>
						<div className='search-form-item'>
							<label htmlFor='category' style={{ margin: 0 }}>
								Category
							</label>
							<SelectField id='category' value={state.category} onChange={onChange} values={categories} />
						</div>
					</div>
				</form>
			</div>
			<TransactionSearchTable transactions={state.transactions} isPending={isPending} />
		</div>
	)
}
