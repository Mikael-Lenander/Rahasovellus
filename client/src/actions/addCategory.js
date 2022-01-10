import {baseUrl} from '../constants/url'
import {ADD_CATEGORY} from '../constants/actionTypes'
import axios from 'axios'

const addCategory = categoryObj => async dispatch => {
    try {
        const {data} = await axios.post(`${baseUrl}/user/category`, categoryObj, {withCredentials: true})
        dispatch({type: ADD_CATEGORY, data: data})
    }
    catch(error) {
        console.log(error)
    }
}

export default addCategory