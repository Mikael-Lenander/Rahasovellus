import { DELETE_CATEGORY, UPDATE_TRANSACTION_CATEGORIES } from '../constants/actionTypes'
import { axiosAuth } from '.'

const deleteCategory = categoryObj => async dispatch => {
	try {
		const { data } = await axiosAuth.delete(`/user/category?type=${categoryObj.type}&category=${categoryObj.category}`)
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
