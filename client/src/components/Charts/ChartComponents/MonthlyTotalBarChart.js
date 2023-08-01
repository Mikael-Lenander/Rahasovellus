import React from 'react'
import { Bar } from 'react-chartjs-2'
import { capitalize } from '../../../utils'
import dayjs from 'dayjs'
import { tooltipOptions, titleOptions, commonOptions } from '../../../utils/chartOptions'
import { CustomColorScale } from '../../../utils/chartjsPlugins'

export default function MontlyTotalBarChart({ dataset, title, type, size, color, yMax }) {
	return (
		<Bar
			data={{
				labels: dataset.map(obj => dayjs(obj.date).format('M/YYYY')),
				datasets: [
					{
						data: dataset.map(obj => obj[type]),
						label: capitalize(type) + (type === 'expense' ? 's' : '')
					}
				]
			}}
			options={{
				...commonOptions(size),
				scales: {
					y: {
						min: 0,
						max: Math.ceil(yMax / 10) * 10
					}
				},
				plugins: {
					title: titleOptions(title),
					tooltip: tooltipOptions,
					customColorScale: {
						color: color
					}
				}
			}}
			plugins={[CustomColorScale]}
		/>
	)
}
