import { axiosAuth } from '.'
import { UPDATE_TRANSACTION, UPDATE_OLDEST_TRANSACTION_DATE } from '../constants/actionTypes'

const updateTransaction = transaction => async dispatch => {
	try {
		const { data } = await axiosAuth.put(`/transaction/update/${transaction._id}`, transaction)
		dispatch({ type: UPDATE_TRANSACTION, transaction: data.transaction })
		dispatch({
			type: UPDATE_OLDEST_TRANSACTION_DATE,
			data: data.oldestTransactionDate
		})
	} catch (error) {
		console.log(error)
	}
}

export default updateTransaction
