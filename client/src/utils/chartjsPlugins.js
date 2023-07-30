import { extractRGBValues } from '.'

export const CustomColorScale = {
	id: 'customColorScale',
	beforeUpdate: (chart, args, options) => {
		const dataset = chart.data.datasets[0]
		const maxHeight = Math.max(...dataset.data)
		const minHeight = 0
		const minDarkness = 1 - options.colorRange
		const color = extractRGBValues(options.color)

		const generateColor = (value, maxValue, minValue) => {
			const percentage = (value - minValue) / (maxValue - minValue) || 0.5
			const darkness = minDarkness + percentage * options.colorRange
			return `rgba(${color.red}, ${color.green}, ${color.blue}, ${darkness})`
		}

		dataset.backgroundColor = dataset.data.map(value => generateColor(value, maxHeight, minHeight))
	},
	defaults: {
		colorRange: 0.6
	}
}