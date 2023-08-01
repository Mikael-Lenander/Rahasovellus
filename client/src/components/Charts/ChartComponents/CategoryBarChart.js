import React from 'react'
import { Bar } from 'react-chartjs-2'
import { titleOptions, tooltipOptions, commonOptions } from '../../../utils/chartOptions'
import { CustomColorScale } from '../../../utils/chartjsPlugins'

export default function CategoryBarChart({ dataset: data, title, size, color, showTotal }) {
	const dataset = showTotal ? data : data.slice(0, -1)
	return (
		<Bar
			data={{
				labels: dataset.map(obj => obj.category),
				datasets: [
					{
						data: dataset.map(obj => obj.mean),
						label: 'Mean'
					}
				]
			}}
			options={{
				...commonOptions(size),
				scales: {
					y: {
						beginAtZero: true
					}
				},
				plugins: {
					title: titleOptions(title),
					tooltip: tooltipOptions,
					customColorScale: {
						color: color,
						colorRange: 0.3
					}
				}
			}}
			plugins={[CustomColorScale]}
		/>
	)
}
