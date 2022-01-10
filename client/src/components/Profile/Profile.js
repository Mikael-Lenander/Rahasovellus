import React, {useEffect} from 'react'
import Header from '../Shared/Header/Header'
import ProfileInfo from './ProfileInfo/ProfileInfo'
import ProfileTransactions from './ProfileTransactions/ProfileTransactions'
import {useDispatch} from 'react-redux'
import getUser from '../../actions/getUser'
import getTransactions from '../../actions/getTransactions'
import './Profile.css'

export default function Profile() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUser())
        dispatch(getTransactions())
    }, [dispatch])

    return (
        <>
        <Header links={[{path: '/charts', text: 'Charts'}, {path: '/dashboard', text: 'Dashboard'}, {path: '/profile', text: 'Profile'}, {logout: true}]}/>
        <main className='profile-grid'>
            <ProfileInfo/>
            <ProfileTransactions/>
        </main>
        </>
    )
}
