import {
  ADD_TRANSACTION,
  DELETE_TRANSACTION,
  FETCH_TRANSACTIONS,
  LOADING_TRANSACTIONS,
  UPDATE_TRANSACTION_CATEGORIES,
  UPDATE_TRANSACTION,
} from '../constants/actionTypes'

const defaultState = {
  data: [],
  fetching: true,
}

const transactionsReducer = function (state = defaultState, action) {
  switch (action.type) {
    case LOADING_TRANSACTIONS:
      return defaultState
    case FETCH_TRANSACTIONS:
      return { data: action.data, fetcing: false }
    case ADD_TRANSACTION:
      return { data: [...state.data, action.transaction], fetching: false }
    case DELETE_TRANSACTION:
      return { data: state.data.filter(transaction => transaction._id !== action.id), fetching: false }
    case UPDATE_TRANSACTION:
      return {
        data: state.data.map(transaction => (transaction._id === action.transaction._id ? action.transaction : transaction)),
        fetching: false,
      }
    case UPDATE_TRANSACTION_CATEGORIES:
      return {
        data: state.data.map(transaction => {
          if (action.data.includes(transaction._id)) transaction.category = 'Other'
          return transaction
        }),
        fetching: false,
      }
    default:
      return state
  }
}

export default transactionsReducer
