import {combineReducers} from 'redux'
import userReducer from './userReducer'
import registerMessagesReducer from './registerMesssagesReducer'
import loginMessageReducer from './loginMessageReducer'
import transactionsReducer from './transactionsReducer'
import updateMessageReducer from './updateMessageReducer'
import chartDataReducer from './chartDataReducer'

export default combineReducers({
  user: userReducer,
  registerMessages: registerMessagesReducer,
  loginMessage: loginMessageReducer,
  transactions: transactionsReducer,
  updateMessage: updateMessageReducer,
  chartData: chartDataReducer
})