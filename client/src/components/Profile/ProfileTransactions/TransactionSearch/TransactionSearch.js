import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'

export default function TransactionSearch({ search }) {
	let categoryTypes = useSelector(state => state.user.data.categories)
	categoryTypes = {
		income: ['Any', ...categoryTypes.income],
		expense: ['Any', ...categoryTypes.expense],
	}
	const [selectedCategoryType, setSelectedCategoryType] = useState('any')
	const [categories, setCategories] = useState(['Any'])
	const [category, setCategory] = useState(categories[0])
	const [minDate, setMinDate] = useState()
	const [maxDate, setMaxDate] = useState()
	const [minAmount, setMinAmount] = useState()
	const [maxAmount, setMaxAmount] = useState()

	function onChangeDropDown(event) {
		const value = event.target.value
		setSelectedCategoryType(value)
		setCategories(value === 'income' ? categoryTypes.income : value === 'expense' ? categoryTypes.expense : ['Any'])
		setCategory(value === 'income' ? categoryTypes.income[0] : value === 'expense' ? categoryTypes.expense[0] : 'Any')
	}

	function onClickSearch(event) {
		event.preventDefault()
		search({
			minAmount: minAmount || -Infinity,
			maxAmount: maxAmount || Infinity,
			minDate: minDate,
			maxDate: maxDate,
			type: selectedCategoryType,
			category: category,
		})
	}
	return (
		<div className='transaction-search'>
			<h1 className='title'>Search for transactions</h1>
			<form>
				<div className='search-form'>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='min-amount' style={{ margin: 0 }}>
							Min amount
						</label>
						<input
							id='min-amount'
							type='number'
							className='form-control text-input'
							min='0'
							step='0.01'
							value={minAmount}
							onChange={e => setMinAmount(e.target.value)}
						/>
					</div>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='max-amount' style={{ margin: 0 }}>
							Max amount
						</label>
						<input
							id='max-amount'
							type='number'
							className='form-control text-input'
							min='0'
							step='0.01'
							value={maxAmount}
							onChange={e => setMaxAmount(e.target.value)}
						/>
					</div>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='from' style={{ margin: 0 }}>
							From
						</label>
						<DatePicker className='form-control text-input' selected={minDate} onChange={date => setMinDate(date)} dateFormat='dd/MM/yyyy' />
					</div>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='to' style={{ margin: 0 }}>
							To
						</label>
						<DatePicker className='form-control text-input' selected={maxDate} onChange={date => setMaxDate(date)} dateFormat='dd/MM/yyyy' />
					</div>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='type' style={{ margin: 0 }}>
							Type
						</label>
						<select className='form-control text-input' value={selectedCategoryType} onChange={onChangeDropDown}>
							<option value='any'>Any</option>
							<option value='income'>Income</option>
							<option value='expense'>Expense</option>
						</select>
					</div>
					<div style={{ margin: '0px 5px 0px 5px' }}>
						<label htmlFor='category' style={{ margin: 0 }}>
							Category
						</label>
						<select className='form-control text-input' value={category} onChange={e => setCategory(e.target.value)}>
							{categories.map(item => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
					</div>
				</div>
				<button className='btn btn-danger' style={{ margin: '10px 5px 0px 5px' }} onClick={onClickSearch}>
					Search
				</button>
			</form>
		</div>
	)
}
