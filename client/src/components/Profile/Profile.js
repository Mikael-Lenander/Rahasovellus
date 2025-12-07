import React, { useEffect } from 'react'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import ProfileTransactions from './ProfileTransactions/ProfileTransactions'
import { useDispatch } from 'react-redux'
import getTransactions from '../../actions/getTransactions'
import './Profile.css'

export default function Profile() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getTransactions())
	}, [dispatch])

	return (
		<main className='profile-grid'>
			<ProfileInfo />
			<ProfileTransactions />
		</main>
	)
}
