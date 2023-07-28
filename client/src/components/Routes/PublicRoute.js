import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
	const user = useSelector(state => state.user.data)

	return <Route {...rest} render={props => (user ? <Redirect to='/dashboard' /> : <Component {...props} />)} />
}

export default PublicRoute
