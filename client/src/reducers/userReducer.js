import { ADD_CATEGORY, DELETE_CATEGORY, LOGGED_IN, LOGGED_OUT, UPDATE_INIT_CAPITAL, UPDATE_OLDEST_TRANSACTION_DATE } from '../constants/actionTypes'

const defaultState = {
	data: '',
	fetching: true,
}

const userReducer = function (state = defaultState, action) {
	switch (action.type) {
		case LOGGED_IN:
			return { data: action.data, fetching: false }
		case LOGGED_OUT:
			return { data: '', fetching: false }
		case UPDATE_INIT_CAPITAL:
			return {
				data: { ...state.data, initCapital: action.data },
				fetching: false,
			}
		case UPDATE_OLDEST_TRANSACTION_DATE:
			return {
				data: { ...state.data, oldestTransactionDate: action.data },
				fetching: false,
			}
		case ADD_CATEGORY:
			return {
				data: { ...state.data, categories: action.data },
				fetching: false,
			}
		case DELETE_CATEGORY:
			return {
				data: { ...state.data, categories: action.data },
				fetching: false,
			}
		default:
			return state
	}
}

export default userReducer
