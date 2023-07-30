import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import getLoginMessage from '../../actions/getLoginMessage'
import getUser from '../../actions/getUser'
import { CLEAR_REGISTER_MESSAGES, CLEAR_LOGIN_MESSAGE } from '../../constants/actionTypes'
import Header from '../Shared/Header/Header'

export default function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const registerMessages = useSelector(state => state.registerMessages)
	const loginMessage = useSelector(state => state.loginMessage)
	const dispatch = useDispatch()
	const loginMessageStyle = loginMessage.success ? 'success' : 'danger'

	function onLogin(e) {
		e.preventDefault()
		clearMessages()
		dispatch(getLoginMessage({ username: username, password: password }))
	}

	useEffect(() => {
		dispatch(getUser())
	}, [loginMessage, dispatch])

	function clearMessages() {
		dispatch({ type: CLEAR_REGISTER_MESSAGES })
		dispatch({ type: CLEAR_LOGIN_MESSAGE })
	}

	return (
		<>
			<Header
				homeLink={{ onClick: clearMessages }}
				links={[
					{ path: '/login', text: 'Login' },
					{ path: '/register', text: 'Register', onClick: clearMessages }
				]}
			/>
			<main className='background flex-center'>
				<form className='credential-form'>
					<h1 className='form-margin'>Login to FinanceTracker</h1>
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
					<div className='form-margin'>
						<button className='btn btn-danger btn-block' type='submit' onClick={onLogin}>
							Login
						</button>
					</div>
					<p className='form-margin'>
						No account?{' '}
						<Link onClick={clearMessages} to='/register'>
							Register for free{' '}
						</Link>
					</p>
					{registerMessages.messages.map(message => (
						<div className='alert alert-success form-margin' role='alert' style={{ marginTop: 10, marginBottom: 10 }} key={message}>
							{message}
						</div>
					))}
					{loginMessage.message && (
						<div className={`alert alert-${loginMessageStyle} form-margin`} role='alert' style={{ marginTop: 10, marginBottom: 10 }}>
							{loginMessage.message}
						</div>
					)}
				</form>
			</main>
		</>
	)
}
