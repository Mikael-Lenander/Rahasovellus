import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import { injectStore } from './actions'

const store = createStore(rootReducer, compose(applyMiddleware(thunk)))
const persistor = persistStore(store)
injectStore(store)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>
)
