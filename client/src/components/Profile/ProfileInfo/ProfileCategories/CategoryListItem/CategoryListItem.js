import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import TransactionCalculator from '../../../../../utils/TransactionCalculator'

export default function CategoryListItem({ category, handleShowModal, type }) {
	const transactions = useSelector(state => state.transactions.data)
	const calculator = new TransactionCalculator(transactions)
	const numOfTransactions = calculator.numberOfTransactions(category)

	return (
		<li className='list-group-item d-flex justify-content-between align-items-center'>
			{category}
			<div>
				{category !== 'Other' && (
					<button
						title='Remove transaction'
						className='btn btn-link shadow-none'
						onClick={() => handleShowModal(type, category)}
						style={{ padding: '5px 8px 5px 0px' }}
					>
						<FontAwesomeIcon icon={faTrashAlt} className='delete-button' title='Delete category' />
					</button>
				)}
				<span
					className='badge badge-primary badge-pill'
					style={{ background: '#2e20ec', width: '33px' }}
					title={
						numOfTransactions === 1
							? `There is 1 transactions with category ${category.toLowerCase()}`
							: `There are ${numOfTransactions} transactions with category ${category.toLowerCase()}`
					}
				>
					{numOfTransactions}
				</span>
			</div>
		</li>
	)
}
