import { baseUrl } from '../constants/url'
import { DELETE_CATEGORY, UPDATE_TRANSACTION_CATEGORIES /* FETCH_TRANSACTIONS */ } from '../constants/actionTypes'
import axios from 'axios'

const deleteCategory = categoryObj => async dispatch => {
	try {
		const { data } = await axios.delete(`${baseUrl}/user/category?type=${categoryObj.type}&category=${categoryObj.category}`, { withCredentials: true })
		dispatch({ type: DELETE_CATEGORY, data: data.categories })
		dispatch({
			type: UPDATE_TRANSACTION_CATEGORIES,
			data: data.transactionIds
		})
	} catch (error) {
		console.log(error)
	}
}

export default deleteCategory
