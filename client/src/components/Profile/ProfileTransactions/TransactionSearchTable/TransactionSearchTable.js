import React from 'react'
import {useSelector} from 'react-redux'
import LoadingScreen from '../../../Shared/LoadingScreen/LoadingScreen'
import Table from '../../../Shared/Table/Table'

export default function TransactionSearchTable({transactions}) {

    const fetching = useSelector(state => state.transactions.fetching)

    return (
        <>
        {fetching
          ? <LoadingScreen style={{color: 'black', width: 60, height: 60}} classes='flex-center transaction-search-table'/>
          : transactions.length > 0
              ? <div className='transaction-search-table'>
                    <Table items={transactions}/>
                </div>
              : <div className='flex-center transaction-search-table'>
                    <h2 style={{fontFamily: 'Arial', fontSize: 22}}>No results</h2>
                </div>
        }
        </>
    )
}
