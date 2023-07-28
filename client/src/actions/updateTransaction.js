import axios from 'axios'
import { baseUrl } from '../constants/url'
import { UPDATE_TRANSACTION, UPDATE_OLDEST_TRANSACTION_DATE } from '../constants/actionTypes'

const updateTransaction = transaction => async dispatch => {
	try {
		const { data } = await axios.put(`${baseUrl}/transaction/update/${transaction._id}`, transaction, { withCredentials: true })
		dispatch({ type: UPDATE_TRANSACTION, transaction: data.transaction })
		dispatch({
			type: UPDATE_OLDEST_TRANSACTION_DATE,
			data: data.oldestTransactionDate,
		})
	} catch (error) {
		console.log(error)
	}
}

export default updateTransaction
