import axios from 'axios'
import { baseUrl } from '../constants/url'
import { FETCH_REGISTER_MESSAGES } from '../constants/actionTypes'

const getRegisterMessages = credentials => async dispatch => {
	try {
		const { data } = await axios.post(`${baseUrl}/register`, credentials)
		dispatch({ type: FETCH_REGISTER_MESSAGES, data: data })
	} catch (error) {
		console.log(error)
		dispatch({
			type: FETCH_REGISTER_MESSAGES,
			data: { messages: ['Registration failed'], success: false }
		})
	}
}

export default getRegisterMessages
