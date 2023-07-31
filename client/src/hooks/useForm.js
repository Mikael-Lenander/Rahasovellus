import { useReducer, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../components/Dashboard/TransactionForm/TransactionForm.css'

const ACTIONS = {
	CHANGE_INPUT: 'CHANGE_INPUT',
	CHANGE_CHECKBOX_GROUP: 'CHANGE_CHECKBOX_GROUP'
}

const formReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.CHANGE_INPUT:
			return {
				...state,
				[action.inputId]: action.value
			}
		case ACTIONS.CHANGE_CHECKBOX_GROUP:
			return {
				...state,
				[action.inputId]: state[action.inputId].map(item => (item.name === action.value ? { ...item, checked: !item.checked } : item))
			}
		default:
			throw new Error(`Unhandled action type: ${action.type}`)
	}
}

export function useForm(initialState) {
	const [state, dispatch] = useReducer(formReducer, initialState)

	const setInput = useCallback((inputId, value) => {
		dispatch({ type: ACTIONS.CHANGE_INPUT, inputId, value })
	}, [])

	const setCheckboxGroup = useCallback((inputId, value) => {
		dispatch({ type: ACTIONS.CHANGE_CHECKBOX_GROUP, inputId, value })
	}, [])

	return { state, setInput, setCheckboxGroup }
}

export function useTransactionForm(initialState, { autoSetCategory } = { autoSetCategory: true }) {
	const { state, setInput } = useForm(initialState)
	const userCategories = useSelector(state => state.user.data.categories)
	const categories = userCategories[state.categoryType]

	useEffect(() => {
		if (autoSetCategory) {
			setInput('category', categories[0])
		}
	}, [state.categoryType, categories, autoSetCategory, setInput])

	return { state: { ...state, categories }, setInput }
}
