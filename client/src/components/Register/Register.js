import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import getRegisterMessages from '../../actions/getRegisterMessages'
import { CLEAR_REGISTER_MESSAGES } from '../../constants/actionTypes'
import Navbar from '../Shared/Navbar/Navbar'

export default function Register(props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const dispatch = useDispatch()
	const registerMessages = useSelector(state => state.registerMessages)

	function onRegister(e) {
		e.preventDefault()
		dispatch({ type: CLEAR_REGISTER_MESSAGES })
		dispatch(getRegisterMessages({ username, password, password2 }))
	}

	useEffect(() => {
		if (registerMessages.success) props.history.push('/login')
	})

	return (
		<>
			<Navbar
				homeLink={true}
				links={[
					{ path: '/login', text: 'Login' },
					{ path: '/register', text: 'Register' }
				]}
			/>
			<main className='background flex-center'>
				<form className='credential-form' style={{ minHeight: 475 }}>
					<h1 className='form-margin' style={{ marginTop: 40 }}>
						Register to FinanceTracker
					</h1>
					<div className='form-group form-margin'>
						<input
							type='text'
							className='form-control'
							id='username'
							placeholder='Username'
							name='username'
							value={username}
							onChange={e => {
								setUsername(e.target.value)
							}}
						/>
					</div>
					<div className='form-group form-margin'>
						<input
							type='password'
							className='form-control'
							id='password'
							placeholder='Password'
							name='password'
							value={password}
							onChange={e => {
								setPassword(e.target.value)
							}}
						/>
					</div>
					<div className='form-group form-margin'>
						<input
							type='password'
							className='form-control'
							id='password'
							placeholder='Confirm password'
							name='password2'
							value={password2}
							onChange={e => {
								setPassword2(e.target.value)
							}}
						/>
					</div>
					<div className='form-margin'>
						<button className='btn btn-danger btn-block' type='submit' onClick={onRegister}>
							Register
						</button>
					</div>
					<p className='form-margin'>
						Already have an account?
						<Link to='/login' onClick={() => dispatch({ type: CLEAR_REGISTER_MESSAGES })}>
							{' '}
							Login here
						</Link>
					</p>
					{registerMessages.messages.map(message => (
						<div className='alert alert-danger form-margin' role='alert' style={{ marginTop: 10, marginBottom: 10 }} key={message}>
							{message}
						</div>
					))}
				</form>
			</main>
		</>
	)
}
