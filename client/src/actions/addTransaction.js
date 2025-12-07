import { axiosAuth } from '.'
import { ADD_TRANSACTION, UPDATE_OLDEST_TRANSACTION_DATE } from '../constants/actionTypes'

const addTransaction = transaction => async dispatch => {
	try {
		const { data } = await axiosAuth.post(`/transaction/new`, transaction)
		dispatch({ type: ADD_TRANSACTION, transaction: data.transaction })
		dispatch({
			type: UPDATE_OLDEST_TRANSACTION_DATE,
			data: data.oldestTransactionDate
		})
	} catch (error) {
		console.log(error)
	}
}

export default addTransaction
