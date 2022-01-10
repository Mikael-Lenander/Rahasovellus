import React from 'react'
import Header from '../Shared/Header/Header'
import './Home.css'

export default function Home() {
    return (
        <>
        <Header links={[{path: '/login', text: 'Login'}, {path: '/register', text: 'Register'}]}/>
        <main className='flex-center background'>
            <h1 className='home-title'>FinanceTracker - Keep track of your expenses and capital growth</h1>
        </main>
        </>
    )
}
