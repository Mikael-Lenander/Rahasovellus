import React from 'react'
import TableItem from './TableItem/TableItem'
import './Table.css'

export default function Table({items}) {
    return (
        <table className='table' style={{width: '100%'}}>
        <colgroup>
          <col span="1" style={{width: '15%'}}/>
          <col span="1" style={{width: '15%'}}/>
          <col span="1" style={{width: '20%'}}/>
          <col span="1" style={{width: '30%'}}/>
          <col span="1" style={{width: '10%'}}/>
          <col span="1" style={{width: '10%'}}/>
        </colgroup>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Comment</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(
            item => <TableItem transaction={item} key={item._id}/>
        )}  
        </tbody>
      </table>
    )
}
