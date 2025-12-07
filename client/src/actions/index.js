import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { BASE_URL } from '../constants/url'
import { REFRESH_TOKENS, LOGGED_OUT, FETCH_LOGIN_MESSAGE } from '../constants/actionTypes'

export const axiosPublic = axios.create({
	baseURL: BASE_URL
})
export const axiosAuth = axios.create({
	baseURL: BASE_URL
})

let store
let refreshPromise = null

export const injectStore = _store => {
	store = _store
}

axiosAuth.interceptors.request.use(
	async config => {
		await refresh(config)
		return config
	},
	error => Promise.reject(error)
)

export const refresh = async config => {
	const date = new Date()
	const user = store.getState().user.data
	if (user?.accessToken == null) return
	const decodedToken = jwtDecode(user.accessToken)
	if (decodedToken.exp * 1000 < date.getTime()) {
		// If a refresh is already in progress, wait for it
		if (refreshPromise) {
			await refreshPromise
			// After refresh completes, use the new token from state
			const updatedUser = store.getState().user.data
			if (updatedUser?.accessToken) {
				config.headers['Authorization'] = `Bearer ${updatedUser.accessToken}`
			}
			return
		}

		// Start a new refresh request
		refreshPromise = (async () => {
			try {
				const { data } = await axiosPublic.post(`/refresh`, { refreshToken: user.refreshToken })
				config.headers['Authorization'] = `Bearer ${data.accessToken}`
				store.dispatch({ type: REFRESH_TOKENS, data: { accessToken: data.accessToken, refreshToken: data.refreshToken } })
			} catch {
				store.dispatch({ type: LOGGED_OUT })
				store.dispatch({ type: FETCH_LOGIN_MESSAGE, data: { message: 'Session expired.', success: false } })
			} finally {
				refreshPromise = null
			}
		})()

		await refreshPromise
	} else {
		config.headers['Authorization'] = `Bearer ${user.accessToken}`
	}
}
