import React from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import {useSelector} from 'react-redux'
import Table from '../../Shared/Table/Table'

export default function TransactionTable() {

    const transactions = useSelector(state => state.transactions.data)
    const latestTransactions = transactions.filter(obj => new Date(obj.date) <= new Date())
                                           .sort((a, b) => new Date(b.date) - new Date(a.date))
                                           .slice(0, 15)

    const fetching = useSelector(state => state.transactions.fetching)

    return (
        <>
        {fetching
          ? <LoadingScreen style={{color: 'black', width: 60, height: 60}} classes='flex-center dashboard-item transaction-table'/>
          : transactions.length > 0
            ? <div className='transaction-table dashboard-item'>
                <Table items={latestTransactions}/>
              </div>
            : <div className='flex-center transaction-table dashboard-item'>
                <h2 style={{fontFamily: 'Arial', fontSize: 22}}>No results</h2>
              </div>
        }
        </>
    )
}
