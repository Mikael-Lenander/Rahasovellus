import React, { useState } from 'react'
import TransactionModal from '../TransactionModal/TransactionModal'
import dayjs from 'dayjs'
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import deleteTransaction from '../../../../actions/deleteTransaction'

export default function TableItem({ transaction }) {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  function onDeleteTransaction() {
    dispatch(deleteTransaction(transaction._id))
  }

  return (
    <>
      <tr>
        <td>{dayjs(transaction.date).format('D/M/YYYY')}</td>
        <td style={{ textTransform: 'capitalize' }}>{transaction.type}</td>
        <td>{transaction.category}</td>
        <td>{transaction.comment}</td>
        <td>{transaction.amount.toFixed(2)}€</td>
        <td>
          <button title='Remove transaction' className='btn btn-link shadow-none icon-button' onClick={handleShowModal}>
            <FontAwesomeIcon icon={faPencilAlt} className='delete-button' />
          </button>
          <button title='Remove transaction' className='btn btn-link shadow-none icon-button' onClick={onDeleteTransaction}>
            <FontAwesomeIcon icon={faTrashAlt} className='delete-button' />
          </button>
        </td>
      </tr>
      <TransactionModal show={showModal} handleClose={handleCloseModal} transaction={transaction} />
    </>
  )
}
