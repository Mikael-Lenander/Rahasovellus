import { extractRGBValues } from './index'
import { CHART_COLORS } from './chartOptions'

export const CustomColorScale = {
	id: 'customColorScale',
	beforeUpdate: (chart, args, options) => {
		const dataset = chart.data.datasets[0]
		const maxHeight = Math.max(...dataset.data.map(Math.abs))
		const minHeight = 0
		const minDarkness = 1 - options.colorRange
		const positiveColor = extractRGBValues(options.color)
		const negativeColor = extractRGBValues(options.negativeColor)

		const generateColor = (value, maxValue, minValue) => {
			const percentage = (Math.abs(value) - minValue) / (maxValue - minValue) || 0.5
			const darkness = minDarkness + percentage * options.colorRange
			const color = value >= 0 ? positiveColor : negativeColor
			return `rgba(${color.red}, ${color.green}, ${color.blue}, ${darkness})`
		}

		dataset.backgroundColor = dataset.data.map(value => generateColor(value, maxHeight, minHeight))
	},
	defaults: {
		colorRange: 0.5,
		color: CHART_COLORS.GREEN,
		negativeColor: CHART_COLORS.RED
	}
}
