import React from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import { Field, SelectField, DateField, RadioGroup } from '../../Shared/Form/formFields'
import { useSelector, useDispatch } from 'react-redux'
import addTransaction from '../../../actions/addTransaction'
import { useTransactionForm } from '../../../hooks/useForm'
import { dateWithTime } from '../../../utils'
import './TransactionForm.css'

export default function TransactionForm() {
	const user = useSelector(state => state.user.data)
	const dispatch = useDispatch()
	const { state, setInput } = useTransactionForm({
		categoryType: 'income',
		date: new Date(),
		amount: '',
		comment: ''
	})


	function onSubmit(event) {
		event.preventDefault()
		const { date, categoryType, category, amount, comment } = state
		const transaction = {
			userId: user.id,
			type: categoryType,
			category: category,
			amount: amount,
			date: dateWithTime(date, 'current'),
			comment: comment
		}
		dispatch(addTransaction(transaction))
		setInput('amount', '')
		setInput('comment', '')
	}
	const fetching = useSelector(state => state.transactions.fetching)

	return (
		<>
			{fetching ? (
				<LoadingScreen style={{ color: 'black', width: 60, height: 60 }} classes='flex-center dashboard-item transaction-form' />
			) : (
				<div className='transaction-form dashboard-item'>
					<form id='transaction-form' className='transaction-form-container' onSubmit={onSubmit}>
						<h1 className='transaction-form-title form-width'>New transaction</h1>
						<RadioGroup id='categoryType' value={state.categoryType} values={['income', 'expense']} onChange={setInput} />
						<TransactionFromFields state={state} setInput={setInput} />
						<div className='form-width'>
							<button className='btn btn-block form-submit' type='submit'>
								Submit
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	)
}

export function TransactionFromFields({ state, setInput }) {
	return (
		<>
			<div className='form-width'>
				<SelectField id='category' value={state.category} values={state.categories} onChange={setInput} />
			</div>
			<div className='form-width'>
				<Field id='amount' type='number' placeholder='amount' min='0.01' step='0.01' required value={state.amount} onChange={setInput} />
			</div>
			<div className='form-width'>
				<Field id='comment' type='text' placeholder='comment (optional)' maxLength='40' value={state.comment} onChange={setInput} />
			</div>
			<div className='form-width'>
				<DateField id='date' placeholderText='date' required value={state.date} onChange={setInput} />
			</div>
		</>
	)
}
