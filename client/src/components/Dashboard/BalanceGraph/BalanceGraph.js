import React, { useRef, useEffect } from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import { useSelector } from 'react-redux'
import * as d3 from 'd3'
import TransactionCalculator from '../../../utils/TransactionCalculator'
import tippy from 'tippy.js'
import dayjs from 'dayjs'
import useResizeObserver from '../../../hooks/useResizeObserver'
import './BalanceGraph.css'

export default function BalanceGraph() {
	const transactions = useSelector(state => state.transactions.data)
	const svgRef = useRef()
	const containerRef = useRef(null)
	const dimensions = useResizeObserver(containerRef)
	const calculator = new TransactionCalculator(transactions)
	const dataset = calculator.monthlyBalances({ months: 12 })

	useEffect(() => {
		if (dimensions && dataset.length > 0) {
			const svg = d3.select(svgRef.current)
			const width = dimensions.width
			const height = dimensions.height
			const margin = { left: 60, right: 30, top: 40, bottom: 25 }
			const innerWidth = width - margin.left - margin.right
			const innerHeight = height - margin.top - margin.bottom

			const balance = d => d.income - d.expense
			const savingsRate = d => ((d.income - d.expense) / d.income) * 100
			const formattedDates = d => dayjs(d.date).format('M/YYYY')

			const [minValue, maxValue] = d3.extent(dataset, d => balance(d))
			const positiveBarRange = (Math.max(0, maxValue) / (maxValue - Math.min(0, minValue))) * innerHeight || 0
			const negativeBarRange = innerHeight - positiveBarRange

			const positiveYScale = d3.scaleLinear().domain([0, maxValue]).range([0, positiveBarRange])

			const negativeYScale = d3.scaleLinear().domain([0, minValue]).range([0, negativeBarRange])

			const yAxisScale = d3
				.scaleLinear()
				.domain(
					(function () {
						if (minValue === maxValue) return maxValue >= 0 ? [0, maxValue] : [maxValue, 0]
						return [minValue, maxValue]
					})()
				)
				.range([margin.top + innerHeight, margin.top])

			const xScale = d3
				.scaleBand()
				.domain(dataset.map(formattedDates))
				.range([margin.left, margin.left + innerWidth])
				.paddingInner(0.05)

			const greenColorScale = d3.scaleLinear().domain([0, maxValue]).range(['#52ff5d', '#29852f'])

			const redColorScale = d3.scaleLinear().domain([0, minValue]).range(['#f24e4e', '#a64641'])

			const yAxis = d3.axisLeft(yAxisScale)
			const xAxis = d3.axisBottom(xScale)

			const tooltipText = d => `${dayjs(d.date).format('MMM YYYY')}</br>
                                      income: ${d.income.toFixed(2)}€</br>
                                      expense: ${d.expense.toFixed(2)}€</br>
                                      balance: ${(balance(d) >= 0 ? '+' : '') + balance(d).toFixed(2)}€</br>
                                      savings rate: ${savingsRate(d).toFixed(2)}%`
			const yPosition = d => margin.top + positiveBarRange - Math.max(0, positiveYScale(balance(d)))
			const rectWidth = Math.min(xScale.bandwidth(), 100)

			svg
				.selectAll('rect')
				.data(dataset)
				.join('rect')
				.attr('x', d => xScale(formattedDates(d)) + xScale.bandwidth() / 2 - rectWidth / 2)
				.attr('y', yPosition)
				.attr('width', rectWidth)
				.attr('height', d => (balance(d) >= 0 ? positiveYScale(balance(d)) : negativeYScale(balance(d))))
				.attr('fill', d => (balance(d) >= 0 ? greenColorScale(balance(d)) : redColorScale(balance(d))))
				.attr('class', 'rect')
				.attr('data-tippy-content', tooltipText)

			const tippys = tippy('.rect', {
				allowHTML: true,
				arrow: false,
				animation: false,
			})

			svg.select('.y-axis').attr('transform', `translate(${margin.left}, 0)`).style('font-size', '15px').call(yAxis)

			svg
				.select('.x-axis')
				.attr('transform', `translate(0, ${margin.top + innerHeight})`)
				.style('font-size', '13px')
				.call(xAxis)

			if (width < 640 && dataset.length > 3) {
				svg
					.select('.x-axis')
					.selectAll('.tick')
					.style('opacity', d => {
						const month = Number(d.split('/')[0])
						return month % 3 === 2 ? 1 : 0
					})
			}

			svg
				.select('.title')
				.text('Monthly balances')
				.attr('x', width / 2)
				.attr('y', 32)

			return () => {
				tippys.forEach(item => {
					item.destroy()
				})
			}
		}
	}, [dataset, dimensions])

	const fetching = useSelector(state => state.transactions.fetching)

	return (
		<div id='balance-graph-container' className='dashboard-item balance-graph' ref={containerRef} style={{ position: 'relative', zIndex: 1 }}>
			{fetching && (
				<LoadingScreen
					style={{
						color: 'black',
						width: 60,
						height: 60,
						position: 'absolute',
						top: '50%',
						marginTop: -30,
					}}
					classes='flex-center'
				/>
			)}
			<svg width='100%' height='100%' ref={svgRef}>
				<g className='x-axis' />
				<g className='y-axis' />
				<text className='title'></text>
			</svg>
			{!fetching && Object.keys(dataset).length === 0 && (
				<div className='flex-center blank-page'>
					<h2 style={{ fontFamily: 'Arial', fontSize: 22 }}>Not enough data</h2>
				</div>
			)}
		</div>
	)
}
