import axios from 'axios'
import { baseUrl } from '../constants/url'
import { LOADING_CHART_DATA, FETCH_CHART_DATA } from '../constants/actionTypes'

const getChartData = (startDate, endDate, chart) => async dispatch => {
	try {
		dispatch({ type: LOADING_CHART_DATA })
		const { data } = await axios.get(`${baseUrl}/transaction/dataset/${chart}?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true })
		dispatch({ type: FETCH_CHART_DATA, data: data })
	} catch (error) {
		console.log(error)
	}
}

export default getChartData
