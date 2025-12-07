import { FETCH_UPDATE_MESSAGE, UPDATE_INIT_CAPITAL } from '../constants/actionTypes'
import { axiosAuth } from '.'

const updateInitCapital = initCapital => async dispatch => {
	try {
		const { data } = await axiosAuth.put(`/user/initCapital`, { initCapital })
		dispatch({
			type: FETCH_UPDATE_MESSAGE,
			data: { message: data.message, success: data.success }
		})
		dispatch({ type: UPDATE_INIT_CAPITAL, data: data.data })
	} catch (error) {
		console.log(error)
		dispatch({
			type: FETCH_UPDATE_MESSAGE,
			data: { message: 'Updating initial capital failed', success: false }
		})
	}
}

export default updateInitCapital
