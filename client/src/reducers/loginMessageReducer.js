import {FETCH_LOGIN_MESSAGE, CLEAR_LOGIN_MESSAGE} from '../constants/actionTypes'

const defaultState = {
    message: '',
    success: false
}

const loginMessagedReducer = function(state=defaultState, action) {
    switch(action.type) {
        case FETCH_LOGIN_MESSAGE:
            return action.data
        case CLEAR_LOGIN_MESSAGE:
            return defaultState
        default:
            return state
    }
}

export default loginMessagedReducer