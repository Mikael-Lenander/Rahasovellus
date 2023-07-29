import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'

const store = createStore(rootReducer, compose(applyMiddleware(thunk)))

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
	<Provider store={store}>
		<App />
	</Provider>
)
