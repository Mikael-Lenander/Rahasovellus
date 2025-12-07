import { ADD_CATEGORY } from '../constants/actionTypes'
import { axiosAuth } from '.'

const addCategory = categoryObj => async dispatch => {
	try {
		const { data } = await axiosAuth.post(`/user/category`, categoryObj)
		dispatch({ type: ADD_CATEGORY, data: data })
	} catch (error) {
		console.log(error)
	}
}

export default addCategory
