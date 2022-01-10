import {LOADING_CHART_DATA, FETCH_CHART_DATA} from '../constants/actionTypes'

const defaultState = {
    fetching: true,
    data: []
}

const chartDataReducer = function(state=defaultState, action) {
    switch (action.type) {
        case LOADING_CHART_DATA:
            return defaultState
        case FETCH_CHART_DATA:
            return {data: action.data, fetching: false}
        default:
            return state
    }
}

export default chartDataReducer