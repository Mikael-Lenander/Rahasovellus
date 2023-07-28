import React from 'react'
import { Link } from 'react-router-dom'
import logoutUser from '../../../actions/logoutUser'
import { useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './Header.css'

export default function Header({ homeLink, links = [] }) {
	const dispatch = useDispatch()

	return (
		<Navbar fixed='top' expand='md' bg='dark' variant='dark' className='header flex-header'>
			<Navbar.Brand className='logo' style={{ color: 'white' }}>
				{homeLink ? (
					<Link {...homeLink} to='/' className='hidden-link' key='homelink'>
						FinanceTracker
					</Link>
				) : (
					<>FinanceTracker</>
				)}
			</Navbar.Brand>
			<Navbar.Toggle aria-controls='responsive-navbar-nav' />
			<Navbar.Collapse id='responsive-nav bar-nav' className='links'>
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
									dispatch(logoutUser())
								}}
							>
								Logout
							</button>
						)
					)}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}
