import axios from 'axios'
import { baseUrl } from '../constants/url'
import { LOGGED_IN, LOGGED_OUT } from '../constants/actionTypes'

const getUser = () => async dispatch => {
	try {
		const { data } = await axios.get(`${baseUrl}/user`, {
			withCredentials: true
		})
		if (!data.user) return dispatch({ type: LOGGED_OUT })
		dispatch({ type: LOGGED_IN, data: data.user })
	} catch (error) {
		console.log(error)
		dispatch({ type: LOGGED_OUT })
	}
}

export default getUser
