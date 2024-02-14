import React, { Suspense } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../Shared/Navbar/Navbar'

const PrivateRoute = ({ component: Component, ...rest }) => {
	const user = useSelector(state => state.user.data)

	return (
		<Route
			{...rest}
			render={props =>
				user ? (
					<>
						<Navbar
							links={[{ path: '/dashboard', text: 'Dashboard' }, { path: '/charts', text: 'Charts' }, { path: '/profile', text: 'Profile' }, { logout: true }]}
						/>
						<Suspense fallback={'Loading'}>
							<Component {...props} />
						</Suspense>
					</>
				) : (
					<Redirect to='/login' />
				)
			}
		/>
	)
}

export default PrivateRoute
