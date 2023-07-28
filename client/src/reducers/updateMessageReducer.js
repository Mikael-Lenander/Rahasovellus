import { CLEAR_UPDATE_MESSAGE, FETCH_UPDATE_MESSAGE } from '../constants/actionTypes'

const defaultState = { message: '', success: false }

const updateMessageReducer = function (state = defaultState, action) {
	switch (action.type) {
		case FETCH_UPDATE_MESSAGE:
			return action.data
		case CLEAR_UPDATE_MESSAGE:
			return defaultState
		default:
			return state
	}
}

export default updateMessageReducer
