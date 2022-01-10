import {baseUrl} from '../constants/url'
import {FETCH_UPDATE_MESSAGE, UPDATE_INIT_CAPITAL} from '../constants/actionTypes'
import axios from 'axios'

const updateInitCapital = initCapital => async dispatch => {
    try {
        // const {data} = await axios.post(`${baseUrl}/user/initCapital`, {initCapital}, {withCredentials: true})
        const {data} = await axios.put(`${baseUrl}/user/initCapital`, {initCapital}, {withCredentials: true})
        dispatch({type: FETCH_UPDATE_MESSAGE, data: {message: data.message, success: data.success}})
        dispatch({type: UPDATE_INIT_CAPITAL, data: data.data})
    }
    catch(error) {
        console.log(error)
        dispatch({type: FETCH_UPDATE_MESSAGE, data: {message: 'Updating initial capital failed', success: false}})
    }
}

export default updateInitCapital