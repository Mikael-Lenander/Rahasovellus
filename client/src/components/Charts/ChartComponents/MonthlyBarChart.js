import React from 'react'
import { Bar } from 'react-chartjs-2'
import { capitalize } from '../../../utils'
import dayjs from 'dayjs'

export default function MonthlyBarChart({ dataset, title, type, size, color }) {
	return (
		<Bar
			data={{
				labels: dataset.map(obj => dayjs(obj.date).format('M/YYYY')),
				datasets: [
					{
						data: dataset.map(obj => obj[type]),
						label: capitalize(type),
						backgroundColor: 'blue'
					}
				]
			}}
			options={{
				responsive: true,
				scales: {
					y: {
						beginAtZero: true
					}
				},
				aspectRatio: size.width / size.height,
				plugins: {
					title: {
						display: true,
						text: title,
						font: {
							size: 25,
							family: 'Roboto, sans-serif'
						}
					},
					tooltip: {
						callbacks: {
							label: context => `${context.dataset.label}: ${context.formattedValue} €`
						},
						displayColors: false
					},
					customColorScale: {
						color: color
					}
				},
				locale: 'fi-FI'
			}}
		/>
	)
}
