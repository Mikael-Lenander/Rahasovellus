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
