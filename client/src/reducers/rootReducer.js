import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './userReducer'
import registerMessagesReducer from './registerMesssagesReducer'
import loginMessageReducer from './loginMessageReducer'
import transactionsReducer from './transactionsReducer'
import updateMessageReducer from './updateMessageReducer'

const userPersistConfig = {
	key: 'user',
	storage
}

const rootReducer = combineReducers({
	user: persistReducer(userPersistConfig, userReducer),
	registerMessages: registerMessagesReducer,
	loginMessage: loginMessageReducer,
	transactions: transactionsReducer,
	updateMessage: updateMessageReducer
})

export default rootReducer
