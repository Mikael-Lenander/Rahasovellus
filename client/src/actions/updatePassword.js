import {baseUrl} from '../constants/url'
import {FETCH_UPDATE_MESSAGE} from '../constants/actionTypes'
import axios from 'axios'

const updatePassword = password => async dispatch => {
    try {
        const {data} = await axios.put(`${baseUrl}/user/password`, {password}, {withCredentials: true})
        dispatch({type: FETCH_UPDATE_MESSAGE, data: data})
    }
    catch(error) {
        console.log(error)
        dispatch({type: FETCH_UPDATE_MESSAGE, data: {message: 'Updating password failed', success: false}})
    }
}

export default updatePassword