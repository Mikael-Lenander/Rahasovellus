import React from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import { TextField, NumberField, SelectField, DateField, RadioGroup } from '../../Shared/Form/formFields'
import { useSelector, useDispatch } from 'react-redux'
import addTransaction from '../../../actions/addTransaction'
import { TransactionForm as TForm } from '../../../hooks/useTransactionForm'
import { dateWithTime } from '../../../utils'
import './TransactionForm.css'

export default function TransactionForm() {
	const user = useSelector(state => state.user.data)
	const dispatch = useDispatch()

	function onSubmit({ state, setInput }) {
		const { date, categoryType, category, amount, comment } = state
		const transaction = {
			userId: user.id,
			type: categoryType,
			category: category,
			amount: amount,
			date: dateWithTime(date, 'current'),
			comment: comment,
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
					<TForm
						id='transaction-form'
						className='transaction-form-container'
						onSubmit={onSubmit}
						initialState={{
							categoryType: 'income',
							date: new Date(),
							amount: '',
							comment: '',
						}}
					>
						{state => (
							<>
								<h1 className='transaction-form-title form-width'>New transaction</h1>
								<RadioGroup id='categoryType' values={['income', 'expense']} />
								<TransactionFromFields state={state} />
								<div className='form-width'>
									<button className='btn btn-block form-submit' type='submit'>
										Submit
									</button>
								</div>
							</>
						)}
					</TForm>
				</div>
			)}
		</>
	)
}

export function TransactionFromFields({ state, ...props }) {
	return (
		<>
			<SelectField id='category' values={state.categories} />
			<NumberField id='amount' placeholder='amount' min='0.01' step='0.01' required />
			<TextField id='comment' placeholder='comment (optional)' maxLength='40' />
			<DateField id='date' placeholderText='date' required />
		</>
	)
}
