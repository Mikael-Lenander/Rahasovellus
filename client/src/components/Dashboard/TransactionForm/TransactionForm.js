import React, {useState} from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import {useSelector, useDispatch} from 'react-redux'
import DatePicker from 'react-datepicker'
import addTransaction from '../../../actions/addTransaction'
import "react-datepicker/dist/react-datepicker.css"
import dayjs from 'dayjs'
import './TransactionForm.css'

export default function TransactionForm() {

    const user = useSelector(state => state.user.data)
    const dispatch = useDispatch()
    const categoryTypes = useSelector(state => state.user.data.categories)
    const [selectedCategoryType, setSelectedCategoryType] = useState('income')
    const [categories, setCategories] = useState(categoryTypes.income)
    const [category, setCategory] = useState(categories[0])
    const [amount, setAmount] = useState('')
    const [comment, setComment] = useState('')
    const [date, setDate] = useState(new Date())

    function onChangeRadioButton(event) {
        setSelectedCategoryType(event.target.value)
        setCategories(event.target.value === 'income' ? categoryTypes.income : categoryTypes.expense)
        setCategory(event.target.value === 'income' ? categoryTypes.income[0] : categoryTypes.expense[0])
    }

    function onSubmit(event) {
        event.preventDefault()
        const selectedDate = [date.getFullYear(), date.getMonth(), date.getDate()]
        const currentTime = [dayjs().hour(), dayjs().minute(), dayjs().second()]
        const dateWithCurrentTime = new Date(...selectedDate, ...currentTime)
        const transaction = {
            userId: user.id,
            type: selectedCategoryType,
            category: category,
            amount: amount,
            date: dateWithCurrentTime,
            comment: comment
        }
        dispatch(addTransaction(transaction))
        setAmount('')
        setComment('')
    }
    const fetching = useSelector(state => state.transactions.fetching)

    return (
        <>
        {fetching
          ? <LoadingScreen style={{color: 'black', width: 60, height: 60}} classes='flex-center dashboard-item transaction-form'/>
          : <div className='transaction-form dashboard-item'>
                <form id='transaction-form' className='transaction-form-container' onSubmit={onSubmit}>
                    <h1 className='transaction-form-title form-width'>New transaction</h1>
                    <div className='flex-center'>
                        <label htmlFor="income" className="radio-button">
                            <input type="radio" id="income" name="transaction-type" tabIndex="1" className='input' value='income'
                            checked={selectedCategoryType === 'income'} onChange={onChangeRadioButton}/>
                            <span>Income</span>
                        </label>
                        <label htmlFor="expense" className="radio-button">
                            <input type="radio" id="expense" name="transaction-type" tabIndex="2" className='input' value='expense'
                            checked={selectedCategoryType === 'expense'} onChange={onChangeRadioButton}/>
                            <span>Expense</span>
                        </label>
                    </div>

                    <div className='text-input form-width'>
                        <select className='form-control input-form' value={category} onChange={e => {setCategory(e.target.value)}}>
                                {categories
                                    .map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className='text-input form-width'>
                        <input className='form-control input-form' type="number" onChange={e => {setAmount(e.target.value)}} 
                                value={amount} placeholder="amount" min='0.01' step='0.01' required/>
                    </div>
                    <div className='text-input form-width'>
                        <input className='form-control input-form' type="text" onChange={e => {setComment(e.target.value)}} 
                                value={comment} placeholder="comment (optional)" maxLength='40'/>
                    </div>
                    <div className='text-input form-width'>
                        <DatePicker required className='form-control input-form' selected={date} onChange={date => setDate(date)}
                                    placeholderText='date' dateFormat="dd/MM/yyyy"/>
                    </div>
                    <div className='form-width'>
                        <button className='btn btn-block' style={{background: 'rgba(8,8,180,1)', color: 'white'}} type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        }
        </>
    )
}
