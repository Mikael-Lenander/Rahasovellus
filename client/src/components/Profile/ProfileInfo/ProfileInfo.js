import React from 'react'
import ProfileSettings from './ProfileSettings/ProfileSettings'
import ProfileCategories from './ProfileCategories/ProfileCategories'
import './ProfileInfo.css'

export default function ProfileInfo() {

    return (
        <section className='profile-section profile-info'>
            <ProfileSettings/>
            <ProfileCategories/>
        </section>
    )
}
