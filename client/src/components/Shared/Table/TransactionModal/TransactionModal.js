import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { TransactionForm } from '../../../../hooks/useTransactionForm'
import { TransactionFromFields } from '../../../Dashboard/TransactionForm/TransactionForm'
import { dateWithTime } from '../../../../utils'
import updateTransaction from '../../../../actions/updateTransaction'
import { useDispatch } from 'react-redux'

function TransactionModal({ show, handleClose, transaction }) {
	const dispatch = useDispatch()

	function onSubmit({ state }) {
		const { category, amount, comment, date } = state
		dispatch(
			updateTransaction({
				_id: transaction._id,
				category,
				amount,
				comment,
				date: dateWithTime(date, transaction.date),
			})
		)
		handleClose()
	}
	const initialState = {
		categoryType: transaction.type,
		category: transaction.category,
		amount: transaction.amount,
		comment: transaction.comment,
		date: new Date(transaction.date),
	}

	return (
		<Modal show={show} onHide={handleClose} dialogClassName='modal-90w'>
			<Modal.Header closeButton>
				<Modal.Title>Edit transaction</Modal.Title>
			</Modal.Header>
			<TransactionForm onSubmit={onSubmit} initialState={initialState} id='modal-transaction-form'>
				{state => (
					<>
						<TransactionFromFields state={state} />
						<Modal.Body></Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={handleClose}>
								Close
							</Button>
							<Button variant='primary form-submit' type='submit'>
								Save Changes
							</Button>
						</Modal.Footer>
					</>
				)}
			</TransactionForm>
		</Modal>
	)
}

export default TransactionModal
