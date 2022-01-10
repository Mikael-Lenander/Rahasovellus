import axios from 'axios'
import {baseUrl} from '../constants/url'
import {FETCH_LOGIN_MESSAGE, LOGGED_IN} from '../constants/actionTypes'

const getLoginMessage = credentials => async dispatch => {
    try {
        const {data} = await axios.post(`${baseUrl}/login`, credentials, { withCredentials: true })
        dispatch({type: FETCH_LOGIN_MESSAGE, data: {message: data.message, success: data.success}})
        if (data.success) {
            dispatch({type: LOGGED_IN, data: data.user})
        }
    }
    catch(error) {
        console.log(error)
        dispatch({type: FETCH_LOGIN_MESSAGE, data: {message: 'Login failed', success: false}})
    }
}

export default getLoginMessage