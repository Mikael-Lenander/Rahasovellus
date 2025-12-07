import { FETCH_UPDATE_MESSAGE } from '../constants/actionTypes'
import { axiosAuth } from '.'

const updatePassword = password => async dispatch => {
	try {
		const { data } = await axiosAuth.put(`/user/password`, { password })
		dispatch({ type: FETCH_UPDATE_MESSAGE, data: data })
	} catch (error) {
		console.log(error)
		dispatch({
			type: FETCH_UPDATE_MESSAGE,
			data: { message: 'Updating password failed', success: false }
		})
	}
}

export default updatePassword
