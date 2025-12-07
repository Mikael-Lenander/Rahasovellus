import { axiosAuth } from '.'
import { DELETE_TRANSACTION, UPDATE_OLDEST_TRANSACTION_DATE } from '../constants/actionTypes'

const deleteTransaction = id => async dispatch => {
	try {
		const { data } = await axiosAuth.delete(`/transaction/delete/${id}`)
		dispatch({ type: DELETE_TRANSACTION, id: data.transaction })
		dispatch({
			type: UPDATE_OLDEST_TRANSACTION_DATE,
			data: data.oldestTransactionDate
		})
	} catch (error) {
		console.log(error)
	}
}

export default deleteTransaction
