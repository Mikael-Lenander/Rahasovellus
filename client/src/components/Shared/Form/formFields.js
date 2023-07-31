import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export function Field({ id, type, value, onChange, ...props }) {
	return <input id={id} type={type} value={value} onChange={e => onChange(id, e.target.value)} className='form-control text-input' {...props} />
}

export function SelectField({ id, value, onChange, values, ...props }) {
	return (
		<select className='form-control text-input' id={id} value={value} onChange={e => onChange(id, e.target.value)} {...props}>
			{values.map(item => (
				<option key={item} value={item}>
					{item}
				</option>
			))}
		</select>
	)
}

export function DateField({ id, value, onChange, ...props }) {
	return <DatePicker className='form-control text-input' selected={value} onChange={date => onChange(id, date)} dateFormat='dd/MM/yyyy' {...props} />
}

export function RadioGroup({ id, value, onChange, values, ...props }) {
	return (
		<div className='flex-center'>
			{values.map(item => (
				<label htmlFor={item} className='radio-button' key={item}>
					<input
						type='radio'
						id={item}
						name={id}
						className='input'
						value={item}
						checked={value === item}
						onChange={e => onChange(id, e.target.value)}
						{...props}
					/>
					<span>{item}</span>
				</label>
			))}
		</div>
	)
}

export function CheckboxGroup({ id, onChange, values, ...props }) {
	return (
		<>
			{values.map(({ name, checked }) => (
				<div key={name} className='form-check form-check-inline'>
					<input type='checkbox' className='form-check-input' name={name} checked={checked} id={name} onChange={() => onChange(id, name)} {...props} />
					<label htmlFor={name} className='form-check-label'>
						{name}
					</label>
				</div>
			))}
		</>
	)
}
