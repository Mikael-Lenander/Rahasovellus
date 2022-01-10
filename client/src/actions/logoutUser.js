import axios from 'axios'
import {baseUrl} from '../constants/url'
import {LOGGED_OUT, FETCH_LOGIN_MESSAGE} from '../constants/actionTypes'


const logoutUser = () => async dispatch => {
    try {
        const {data}  = await axios.get(`${baseUrl}/logout`, {withCredentials: true})
        dispatch({type: LOGGED_OUT})
        dispatch({type: FETCH_LOGIN_MESSAGE, data: data})
    }
    catch (error) {
        console.log(error)
    }
}

export default logoutUser