import { Line } from 'react-chartjs-2'
import { CHART_COLORS } from '../../../utils/chartOptions'
import 'chartjs-adapter-date-fns'
import { fi } from 'date-fns/locale'
import { tooltipOptions, titleOptions, commonOptions } from '../../../utils/chartOptions'

export default function NetWorthChart({ dataset, size }) {
	const lineColors = context => {
		const dataset = context.chart.data.datasets[0].data
		return dataset.map(value => (value >= 0 ? CHART_COLORS.GREEN : CHART_COLORS.RED))
	}
	const lineColor = dataset.length < 30 ? lineColors : 'rgba(0, 0, 0, 0)'

	return (
		<Line
			data={{
				labels: dataset.map(obj => new Date(obj.date)),
				datasets: [
					{
						fill: {
							target: 'origin',
							above: CHART_COLORS.LIGHT_GREEN,
							below: CHART_COLORS.LIGHT_RED
						},
						label: 'Net worth',
						data: dataset.map(obj => obj.capital),
						borderColor: function (context) {
							const { ctx, chartArea, scales } = context.chart
							if (!chartArea) {
								return null
							}
							const chartHeight = chartArea.bottom - chartArea.top
							const positiveAreaHeight = scales.y.getPixelForValue(0) - chartArea.top
							const positiveAreaPercentage = positiveAreaHeight / chartHeight
							const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartHeight + chartArea.top)
							gradient.addColorStop(positiveAreaPercentage, CHART_COLORS.GREEN)
							gradient.addColorStop(positiveAreaPercentage, CHART_COLORS.RED)
							return gradient
						},
						backgroundColor: 'black',
						pointBackgroundColor: lineColor,
						pointBorderColor: lineColor,
						borderWidth: 5,
						pointRadius: 2,
						cubicInterpolationMode: 'monotone'
					}
				]
			}}
			options={{
				...commonOptions(size),
				scales: {
					y: {
						beginAtZero: true
					},
					x: {
						type: 'time',
						time: {
							tooltipFormat: 'dd.MM.yyyy'
						},
						adapters: {
							date: {
								locale: fi
							}
						}
					}
				},
				plugins: {
					title: titleOptions('Net worth'),
					tooltip: tooltipOptions
				}
			}}
		/>
	)
}
