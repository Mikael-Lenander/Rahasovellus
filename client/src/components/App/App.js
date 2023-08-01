import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'tippy.js/dist/tippy.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from '../Home/Home'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Dashboard from '../Dashboard/Dashboard'
import Charts from '../Charts/Charts'
import Profile from '../Profile/Profile'
import Navbar from '../Shared/Navbar/Navbar'
import PrivateRoute from '../Routes/PrivateRoute'
import PublicRoute from '../Routes/PublicRoute'
// import Footer from '../Footer/Footer'
import LoadingScreen from '../Shared/LoadingScreen/LoadingScreen'
import getUser from '../../actions/getUser'
import getTransactions from '../../actions/getTransactions'

function App() {
	const dispatch = useDispatch()
	const fetching = useSelector(state => state.user.fetching)
	const user = useSelector(state => state.user.data)
	console.log('user', user)

	useEffect(() => {
		dispatch(getUser())
		dispatch(getTransactions())
	}, [dispatch])

	return (
		<>
			{fetching ? (
				<>
					<Navbar />
					<LoadingScreen classes='flex-center background' size='6x' />
				</>
			) : (
				<>
					<BrowserRouter>
						<Switch>
							<PublicRoute exact path='/' component={Home} />
							<PublicRoute exact path='/login' component={Login} />
							<PublicRoute exact path='/register' component={Register} />
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
							<PrivateRoute exact path='/charts' component={Charts} />
							<PrivateRoute exact path='/profile' component={Profile} />
							<Route path='*' component={() => '404 PAGE NOT FOUND'} />
						</Switch>
					</BrowserRouter>
					{/* <Footer/> */}
				</>
			)}
		</>
	)
}

export default App
