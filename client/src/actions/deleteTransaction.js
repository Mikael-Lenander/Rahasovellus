import axios from 'axios'
import {baseUrl} from '../constants/url'
import {DELETE_TRANSACTION, UPDATE_OLDEST_TRANSACTION_DATE} from '../constants/actionTypes'

const deleteTransaction = id => async dispatch => {
    try {
        const {data} = await axios.delete(`${baseUrl}/transaction/delete/${id}`, {withCredentials: true})
        dispatch({type: DELETE_TRANSACTION, id: data.transaction})
        dispatch({type: UPDATE_OLDEST_TRANSACTION_DATE, data: data.oldestTransactionDate})
    }
    catch(error) {
        console.log(error)
    }
}

export default deleteTransaction