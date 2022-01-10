import React from 'react'
import dayjs from 'dayjs'
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useDispatch} from 'react-redux'
import deleteTransaction from '../../../../actions/deleteTransaction'

export default function TransactionTableItem({transaction}) {

    const dispatch = useDispatch()

    function onDeleteTransaction() {
        dispatch(deleteTransaction(transaction._id))
    }

    return (
        <>
        <tr>
            <td>{dayjs(transaction.date).format('D/M/YYYY')}</td>
            <td style={{textTransform: 'capitalize'}}>{transaction.type}</td>
            <td>{transaction.category}</td>
            <td>{transaction.comment}</td>
            <td>{transaction.amount.toFixed(2)}€</td>
            <td><button title='Remove transaction' className='btn btn-link shadow-none' onClick={onDeleteTransaction}>
                    <FontAwesomeIcon icon={faTrashAlt} className='delete-button'/>
                </button>
            </td>
        </tr>
        </>
    )
}
