import React, {useState, useEffect} from 'react'
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {useSelector, useDispatch} from 'react-redux'
import updateInitCapital from '../../../../actions/updateInitCapital'
import updatePassword from '../../../../actions/updatePassword'
import {CLEAR_UPDATE_MESSAGE} from '../../../../constants/actionTypes'

export default function ProfileSettings() {

    const user = useSelector(state => state.user.data)
    const updateMessage = useSelector(state => state.updateMessage)
    const [initCapital, setInitCapital] = useState(user.initCapital)
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    function onUpdateInitCapital(event) {
        event.preventDefault()
        if (initCapital !== user.initCapital) {
            dispatch(updateInitCapital(initCapital))
        }
    }

    function onUpdatePassword(event) {
        event.preventDefault()
        if (password) {
            dispatch(updatePassword(password))
        }
    }

    useEffect(() => {
        dispatch({type: CLEAR_UPDATE_MESSAGE})
    }, [dispatch])

    return (
        <div className='profile-settings'>
            <h1 className='title'>Your Profile</h1>
            <div className='profile-settings-container'>
                <div className='icon-container'>
                    <FontAwesomeIcon icon={faUser} size='7x' className='profile-icon'/>
                </div>
                <div className='form-container'>
                    <form className="profile-form" onSubmit={onUpdateInitCapital}>
                        <label htmlFor="init-capital">Initial capital</label>
                        <div className='row form-group'>
                            <div className='col-9'>
                                <input type="number" className="form-control text-input" id="init-capital" min='0' step='0.01'
                                 value={initCapital} onChange={event => setInitCapital(event.target.value)}/>
                            </div>
                            <div className='col-3' style={{padding: 0}}>
                                <button type="submit" className="btn btn-danger">Save</button>
                            </div>
                        </div>
                    </form>
                    <form className="profile-form" onSubmit={onUpdatePassword}>
                        <label htmlFor="password">Change password</label>
                        <div className='row form-group password-field'>
                            <div className='col-9'>
                                <input type={showPassword ? "text" : "password"} className="form-control text-input" id="password"
                                 value={password} onChange={e => setPassword(e.target.value)} disabled={user.username === 'demouser'}
                                 placeholder={user.username === 'demouser' ? "demouser's password can't be updated" : ''}/>
                            </div>
                            <div className='col-3' style={{padding: 0}}>
                                <button type="submit" className="btn btn-danger" disabled={user.username === 'demouser'}>Save</button>
                            </div>
                        </div>
                        <div className="form-check-inline show-password">
                            <input className="form-check-input" type="checkbox" id="show-password" onClick={() => setShowPassword(current => !current)}/>
                            <label className="form-check-label" htmlFor="show-password">Show password</label>
                        </div>
                    </form>
                </div>
            </div>
            {updateMessage.message && <div className={`alert alert-message alert-${updateMessage.success ? 'success' : 'danger'}`}
                     role="alert">
                            {updateMessage.message}
                    </div>}
        </div>
    )
}
