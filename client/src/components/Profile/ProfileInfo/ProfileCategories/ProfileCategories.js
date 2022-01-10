import React, {useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import CategoryListItem from './CategoryListItem/CategoryListItem'
import LoadingScreen from '../../../Shared/LoadingScreen/LoadingScreen'
import deleteCategory from '../../../../actions/deleteCategory'
import addCategory from '../../../../actions/addCategory'
import Modal from 'react-bootstrap/Modal'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

export default function ProfileCategories() {

    const [newCategoryName, setNewCategoryName] = useState('')
    const categoryNameRef = useRef()
    const [newCategoryType, setNewCategoryType] = useState('income')
    const [categoryOnDeletion, setCategoryOnDeletion] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [categoryInputError, setCategoryInputError] = useState('')
    const [categoryOverloadError, setCategoryOverloadError] = useState('')
    const categoryTypes = useSelector(state => state.user.data.categories)
    const fetching = useSelector(state => state.transactions.fetching)
    const dispatch = useDispatch()

    function onDeleteCategory() {
        dispatch(deleteCategory(categoryOnDeletion))
        setShowModal(false)
    }

    function handleShowModal(type, category) {
        setShowModal(true)
        setCategoryOnDeletion({type, category})
    }

    function onChangeNewCategoryName(event) {
        const value = event.target.value.replace(/[^\w\s]/, '')
        setNewCategoryName(value)
        if (categoryTypes.income.concat(categoryTypes.expense).map(item => item.toLowerCase()).includes(value.toLowerCase())) {
                setCategoryInputError('Category already exists')
            }
        else if (value.split(' ').some(word => word.length > 14)) {
            setCategoryInputError('One word should not exceed 14 characters')
        }
        else {
            setCategoryInputError('')
        }
    }

    function onChangeNewCategoryType(event) {
        setNewCategoryType(event.target.value)
    }

    function onAddCategory(event) {
        event.preventDefault()
        if (!categoryInputError && !categoryOverloadError) {
            dispatch(addCategory({type: newCategoryType, category: newCategoryName}))
            setNewCategoryName('')
        }
    }

    useEffect(() => {
        const value = categoryNameRef?.current?.value
        if (value && categoryTypes[newCategoryType].length === 10) {
            setCategoryOverloadError("You can't have more than 10 categories")
        }
        else setCategoryOverloadError('')
    }, [categoryTypes, newCategoryType, newCategoryName])

    return (
        <>
        {fetching
          ? <LoadingScreen style={{color: 'black', width: 60, height: 60}} classes='flex-center profile-categories'/>
          : <>
            <div className='profile-categories'>
                <div className='category-form-container'>
                    <h1 className='title'>Your Categories</h1>
                    <form className='category-form' onSubmit={onAddCategory}>
                        <div>
                            <label htmlFor='add-category' className='col-form-label'>Add category</label>
                        </div>
                        <div>
                            <select className='form-control text-input' value={newCategoryType}
                             onChange={onChangeNewCategoryType}>
                                <option value='income'>income</option>
                                <option value='expense'>expense</option>
                            </select>
                        </div>
                        <div>
                            <Tippy content={categoryOverloadError || categoryInputError}
                                visible={(categoryInputError || categoryOverloadError) && !showModal}>
                                <input className='form-control text-input' placeholder='category name' ref={categoryNameRef}
                                value={newCategoryName} onChange={onChangeNewCategoryName} maxLength='25'/>
                            </Tippy>
                        </div>
                        <div>
                            <button className='btn btn-danger' type='submit'>Add</button>
                        </div>
                    </form>
                </div>
                <div className='category-list-container'>
                    <div className='category-list-div'>
                        <h2 className='category-title'>Income</h2>
                        <ul className="list-group category-list" style={{height: '86%', overflowY: 'auto'}}>
                            {categoryTypes.income.map((category, idx) =>
                                <CategoryListItem category={category} key={category + idx.toString()} type='income'
                                 handleShowModal={handleShowModal} onDeleteCategory={onDeleteCategory}/>
                            )}
                        </ul>
                    </div>
                    <div className='category-list-div'>
                        <h2 className='category-title'>Expense</h2>
                        <ul className="list-group category-list" style={{height: '86%', overflowY: 'auto'}}>
                            {categoryTypes.expense.map((category, idx) =>
                                <CategoryListItem category={category} key={category + idx.toString()} type='expense'
                                 handleShowModal={handleShowModal} onDeleteCategory={onDeleteCategory}/>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal}
                style={{fontFamily: 'Arial', borderRadius: '50px'}}
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Are you sure you want to delete category {categoryOnDeletion.category}?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                    All transactions with this category will be moved to the "Other"-category.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' style={{background: '#2e20ec'}}
                            onClick={() => setShowModal(false)}>
                        Cancel
                     </button>
                    <button className='btn btn-danger' onClick={onDeleteCategory}>Delete</button>
                </Modal.Footer>
            </Modal>
            </>
        }
        </>
    )
}