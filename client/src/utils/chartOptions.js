import { asEuros } from './index.js'

export const tooltipOptions = {
	callbacks: {
		label: context => {
      const y = context.parsed?.y ?? context.parsed
			return `${context.dataset.label}: ${asEuros(y)}`
		}
	},
	displayColors: false
}

export const titleOptions = title => ({
	display: true,
	text: title,
	font: {
		size: 25,
		family: 'Roboto, sans-serif'
	}
})

export const commonOptions = size => ({
	responsive: true,
	aspectRatio: size.width / size.height,
	locale: 'fi-FI'
})

export const CHART_COLORS = {
	RED: 'rgb(166, 70, 65)',
	GREEN: 'rgb(41, 133, 47)',
	LIGHT_GREEN: 'rgb(41, 133, 47, 0.5)',
	LIGHT_RED: 'rgb(166, 70, 65, 0.5)'
}