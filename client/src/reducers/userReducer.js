import {
	ADD_CATEGORY,
	DELETE_CATEGORY,
	LOGGED_IN,
	LOGGED_OUT,
	UPDATE_INIT_CAPITAL,
	UPDATE_OLDEST_TRANSACTION_DATE,
	REFRESH_TOKENS
} from '../constants/actionTypes'

const defaultState = {
	data: null,
	fetching: true
}

const userReducer = function (state = defaultState, action) {
	switch (action.type) {
		case LOGGED_IN:
			return { data: action.data, fetching: false }
		case LOGGED_OUT:
			return { data: null, fetching: false }
		case UPDATE_INIT_CAPITAL:
			return {
				data: { ...state.data, initCapital: action.data },
				fetching: false
			}
		case UPDATE_OLDEST_TRANSACTION_DATE:
			return {
				data: { ...state.data, oldestTransactionDate: action.data },
				fetching: false
			}
		case ADD_CATEGORY:
			return {
				data: { ...state.data, categories: action.data },
				fetching: false
			}
		case DELETE_CATEGORY:
			return {
				data: { ...state.data, categories: action.data },
				fetching: false
			}
		case REFRESH_TOKENS:
			return {
				data: { ...state.data, accessToken: action.data.accessToken, refreshToken: action.data.refreshToken },
				fetching: false
			}
		default:
			return state
	}
}

export default userReducer
