import React from 'react'
import { useInput } from '../../../hooks/useTransactionForm'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function Input({ component: Component, id, textField = true, ...props }) {
	const [value, setValue] = useInput(id)

	const Field = <Component id={id} value={value} onChange={e => setValue(e.target.value)} {...props} />

	return textField ? <div className='text-input form-width'>{Field}</div> : Field
}

export function TextField(props) {
	return <Input component='input' type='text' className='form-control input-form' {...props} />
}

export function NumberField(props) {
	return <Input component='input' type='number' className='form-control input-form' {...props} />
}

export function SelectField({ values, ...props }) {
	const Select = props => (
		<select className='form-control input-form' {...props}>
			{values.map(item => (
				<option key={item} value={item}>
					{item}
				</option>
			))}
		</select>
	)
	return <Input component={Select} {...props} />
}

export function DateField(props) {
	const Date = ({ value, onChange, ...props }) => (
		<DatePicker
			className='form-control input-form'
			selected={value}
			onChange={date => onChange({ target: { value: date } })}
			dateFormat='dd/MM/yyyy'
			{...props}
		/>
	)
	return <Input component={Date} {...props} />
}

export function RadioGroup({ values, id, ...props }) {
	const Radio = ({ value, onChange }) => (
		<div className='flex-center'>
			{values.map(item => (
				<label htmlFor={item} className='radio-button' key={item}>
					<input type='radio' id={item} name={id} className='input' value={item} checked={value === item} onChange={onChange} />
					<span>{item}</span>
				</label>
			))}
		</div>
	)
	return <Input id={id} component={Radio} textField={false} {...props} />
}
