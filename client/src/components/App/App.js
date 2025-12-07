import React, { lazy } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'tippy.js/dist/tippy.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from '../Home/Home'
import Login from '../Login/Login'
import Register from '../Register/Register'
import PrivateRoute from '../Routes/PrivateRoute'
import PublicRoute from '../Routes/PublicRoute'

const Dashboard = lazy(() => import('../Dashboard/Dashboard'))
const Charts = lazy(() => import('../Charts/Charts'))
const Profile = lazy(() => import('../Profile/Profile'))

function App() {
	return (
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
	)
}

export default App
