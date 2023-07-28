import { FETCH_REGISTER_MESSAGES, CLEAR_REGISTER_MESSAGES } from '../constants/actionTypes'

const defaultState = { messages: [], success: false }

const registerMessagesdReducer = function (state = defaultState, action) {
	switch (action.type) {
		case FETCH_REGISTER_MESSAGES:
			return action.data
		case CLEAR_REGISTER_MESSAGES:
			return defaultState
		default:
			return state
	}
}

export default registerMessagesdReducer
