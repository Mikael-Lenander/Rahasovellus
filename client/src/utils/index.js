import dayjs from 'dayjs'

export function sortedByDate(objects, order = 'asc') {
	const orderMultiplier = order === 'asc' ? 1 : -1
	return objects.toSorted((a, b) => (new Date(a.date) - new Date(b.date)) * orderMultiplier)
}

export function dateWithTime(date, timeDate) {
	const dateTime = timeDate === 'current' ? timeOfDate(new Date()) : timeOfDate(timeDate)
	const selectedDate = [date.getFullYear(), date.getMonth(), date.getDate()]
	return new Date(...selectedDate, ...dateTime)
}

function timeOfDate(date) {
	const d = dayjs(date)
	return [d.hour(), d.minute(), d.second()]
}

export function extractRGBValues(rgbString) {
	const matches = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
	if (matches) {
		const [, red, green, blue] = matches
		return {
			red: parseInt(red, 10),
			green: parseInt(green, 10),
			blue: parseInt(blue, 10)
		}
	} else {
		throw new Error('Invalid RGB color string')
	}
}

export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
