import { axiosPublic } from '.'
import { FETCH_LOGIN_MESSAGE, LOGGED_IN } from '../constants/actionTypes'

const getLoginMessage = credentials => async dispatch => {
	try {
		const { data } = await axiosPublic.post(`/login`, credentials)
		dispatch({
			type: FETCH_LOGIN_MESSAGE,
			data: { message: data.message, success: data.success }
		})
		if (data.success) {
			dispatch({ type: LOGGED_IN, data: data.user })
		}
	} catch (error) {
		const errorMessage = error.response?.data?.error || 'Login failed'
		dispatch({
			type: FETCH_LOGIN_MESSAGE,
			data: { message: errorMessage, success: false }
		})
	}
}

export default getLoginMessage
