import React from 'react'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './LoadingScreen.css'

export default function LoadingScreen({ classes, containerStyle={}, ...rest }) {
	return (
		<>
			<div className={classes} style={containerStyle}>
				<FontAwesomeIcon icon={faCircleNotch} className='spinner' {...rest} />
			</div>
		</>
	)
}
