import React from 'react'
import { Bar } from 'react-chartjs-2'
import { titleOptions, tooltipOptions } from '../chartOptions'

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
				responsive: true,
				scales: {
					y: {
						beginAtZero: true
					}
				},
				aspectRatio: size.width / size.height,
				plugins: {
					title: titleOptions(title),
					tooltip: tooltipOptions,
					customColorScale: {
            color: color,
            colorRange: 0.3
          }
				},
				locale: 'fi-FI'
			}}
		/>
	)
}
