import axios from 'axios'
import { FETCH_TRANSACTIONS, LOADING_TRANSACTIONS } from '../constants/actionTypes'
import { baseUrl } from '../constants/url'

const getTransactions = () => async dispatch => {
	try {
		dispatch({ type: LOADING_TRANSACTIONS })
		const { data } = await axios.get(`${baseUrl}/transaction/all`, {
			withCredentials: true
		})
		dispatch({ type: FETCH_TRANSACTIONS, data: data })
	} catch (error) {
		console.log(error)
	}
}

export default getTransactions
