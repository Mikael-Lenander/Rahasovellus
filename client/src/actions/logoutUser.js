import { axiosPublic } from '.'
import { LOGGED_OUT, FETCH_LOGIN_MESSAGE } from '../constants/actionTypes'

const logoutUser = refreshToken => async dispatch => {
	try {
		const { data } = await axiosPublic.post(`/logout`, { refreshToken })
		dispatch({ type: LOGGED_OUT })
		dispatch({ type: FETCH_LOGIN_MESSAGE, data: data })
	} catch (error) {
		console.log(error)
	}
}

export default logoutUser
