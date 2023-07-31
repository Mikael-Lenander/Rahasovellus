import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useTransactionForm } from '../../../../hooks/useForm'
import { TransactionFromFields } from '../../../Dashboard/TransactionForm/TransactionForm'
import { dateWithTime } from '../../../../utils'
import updateTransaction from '../../../../actions/updateTransaction'
import { useDispatch } from 'react-redux'

function TransactionModal({ show, handleClose, transaction }) {
	const dispatch = useDispatch()
	const { state, setInput } = useTransactionForm(
		{
			categoryType: transaction.type,
			category: transaction.category,
			amount: transaction.amount,
			comment: transaction.comment,
			date: new Date(transaction.date)
		},
		{
			autoSetCategory: false
		}
	)

	function onSubmit(event) {
		event.preventDefault()
		const { category, amount, comment, date } = state
		dispatch(
			updateTransaction({
				_id: transaction._id,
				category,
				amount,
				comment,
				date: dateWithTime(date, transaction.date)
			})
		)
		handleClose()
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header>
				<Modal.Title>Edit transaction</Modal.Title>
			</Modal.Header>
			<form id='modal-transaction-form' onSubmit={onSubmit}>
				<TransactionFromFields state={state} setInput={setInput} />
				<Modal.Body></Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary form-submit' type='submit'>
						Save Changes
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	)
}

export default TransactionModal
