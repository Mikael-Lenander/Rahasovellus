import { useReducer, useEffect, useCallback, useContext, createContext } from 'react'
import { CHANGE_INPUT } from '../constants/actionTypes'
import { useSelector } from 'react-redux'
import '../components/Dashboard/TransactionForm/TransactionForm.css'

const transactionFormReducer = (state, action) => {
	switch (action.type) {
		case CHANGE_INPUT:
			return {
				...state,
				[action.inputId]: action.value
			}
		default:
			throw new Error(`Unhandled action type: ${action.type}`)
	}
}

const TransactionFormContext = createContext()

export function useInput(inputId) {
	const [state, setInput] = useContext(TransactionFormContext)
	return [state[inputId], value => setInput(inputId, value)]
}

export function TransactionForm({ initialState, onSubmit, children, ...props }) {
	const [state, dispatch] = useReducer(transactionFormReducer, initialState)
	const userCategories = useSelector(state => state.user.data.categories)
	const categories = userCategories[state.categoryType]
	const formState = { ...state, categories }

	const setInput = useCallback((inputId, value) => {
		dispatch({ type: CHANGE_INPUT, inputId, value })
	}, [])

	const handleSubmit = event => {
		event.preventDefault()
		onSubmit({ state: formState, setInput })
	}

	useEffect(() => {
		setInput('category', categories[0])
	}, [state.categoryType, categories, setInput])

	return (
		<TransactionFormContext.Provider value={[formState, setInput]}>
			<form onSubmit={handleSubmit} {...props}>
				{children(formState)}
			</form>
		</TransactionFormContext.Provider>
	)
}
