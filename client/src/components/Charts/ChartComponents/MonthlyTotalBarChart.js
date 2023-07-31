import React from 'react'
import { Bar } from 'react-chartjs-2'
import { capitalize } from '../../../utils'
import dayjs from 'dayjs'
import { tooltipOptions, titleOptions } from '../chartOptions'

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
				responsive: true,
				scales: {
					y: {
						min: 0,
						max: Math.ceil(yMax / 10) * 10
					}
				},
				aspectRatio: size.width / size.height,
				plugins: {
					title: titleOptions(title),
					tooltip: tooltipOptions,
					customColorScale: {
						color: color
					}
				},
				locale: 'fi-FI'
			}}
		/>
	)
}
