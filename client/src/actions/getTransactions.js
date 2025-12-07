import { axiosAuth } from '.'
import { FETCH_TRANSACTIONS, LOADING_TRANSACTIONS } from '../constants/actionTypes'

const getTransactions = () => async dispatch => {
	try {
		dispatch({ type: LOADING_TRANSACTIONS })
		const { data } = await axiosAuth.get(`/transaction/all`)
		dispatch({ type: FETCH_TRANSACTIONS, data: data })
	} catch (error) {
		console.log(error)
	}
}

export default getTransactions
