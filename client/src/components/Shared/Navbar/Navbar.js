import React from 'react'
import { Link } from 'react-router-dom'
import logoutUser from '../../../actions/logoutUser'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import BNavbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './Navbar.css'

export default function Navbar({ homeLink, links = [] }) {
	const user = useSelector(state => state.user.data)
	const dispatch = useDispatch()

	return (
		<BNavbar fixed='top' expand='md' bg='dark' variant='dark' className='header flex-header'>
			<BNavbar.Brand className='logo' style={{ color: 'white' }}>
				{homeLink ? (
					<Link {...homeLink} to='/' className='hidden-link' key='homelink'>
						FinanceTracker
					</Link>
				) : (
					<>FinanceTracker</>
				)}
			</BNavbar.Brand>
			<BNavbar.Toggle aria-controls='responsive-navbar-nav' />
			<BNavbar.Collapse id='responsive-nav bar-nav' className='links'>
				<Nav className='nav'>
					{links.map(({ path, text, logout, ...rest }) =>
						!logout ? (
							<button key={text} className='btn btn-link' {...rest}>
								<Link to={path} style={{ color: 'white' }}>
									{text}
								</Link>
							</button>
						) : (
							<button
								key='logout'
								className='btn btn-link'
								style={{ color: 'white' }}
								onClick={() => {
									dispatch(logoutUser(user.refreshToken))
								}}
							>
								Logout
							</button>
						)
					)}
				</Nav>
			</BNavbar.Collapse>
		</BNavbar>
	)
}
