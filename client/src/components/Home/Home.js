import React from 'react'
import Navbar from '../Shared/Navbar/Navbar'
import './Home.css'

export default function Home() {
	return (
		<>
			<Navbar
				links={[
					{ path: '/login', text: 'Login' },
					{ path: '/register', text: 'Register' }
				]}
			/>
			<main className='flex-center background'>
				<h1 className='home-title'>FinanceTracker - Keep track of your expenses and capital growth</h1>
			</main>
		</>
	)
}
