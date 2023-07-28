import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'

const store = createStore(rootReducer, compose(applyMiddleware(thunk)))

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
