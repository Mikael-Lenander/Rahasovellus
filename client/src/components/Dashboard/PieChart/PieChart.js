import React, { useEffect, useRef, useCallback } from 'react'
import LoadingScreen from '../../Shared/LoadingScreen/LoadingScreen'
import { useSelector } from 'react-redux'
import * as d3 from 'd3'
import TransactionCalculator from '../../../utils/TransactionCalculator'
import useResizeObserver from '../../../hooks/useResizeObserver'
import tippy from 'tippy.js'
import './PieChart.css'

export default function PieChart({ className, title, type, tippys }) {
	const transactions = useSelector(state => state.transactions.data)
	const svgRef = useRef()
	const containerRef = useRef(null)
	const dimensions = useResizeObserver(containerRef)
	const calculator = new TransactionCalculator(transactions)
	const dataset = calculator.monthlyCategories(type)
	const sums = calculator.monthlyBalances({ months: 1 })[0] || { income: 0, expense: 0 }

	const total = type === 'income' ? sums.income : sums.expense

	const sortSlices = useCallback(data => {
		if (data.length === 0) return []
		if (data.length === 1) return [data[0]]
		let min, max
		for (let item of data) {
			if (item[1] === d3.max(data, d => d[1])) {
				max = item
				break
			}
		}
		for (let item of data) {
			if (item[1] === d3.min(data, d => d[1])) {
				min = item
				break
			}
		}
		return [max, min].concat(sortSlices(data.filter(item => item[0] !== min[0] && item[0] !== max[0])))
	}, [])

	useEffect(() => {
		if (dimensions && Object.keys(dataset).length > 0) {
			const svg = d3.select(svgRef.current)
			const width = dimensions.width
			const height = dimensions.height
			const margin = 45
			const marginTop = 15
			const r = Math.min(width, height) / 2 - margin

			const datasetLength = Object.keys(dataset).length
			const colorScale = d3.scaleOrdinal().domain(Object.keys(dataset)).range(d3.schemeSet1.slice(0, datasetLength))

			const entries = sortSlices(Object.entries(dataset))
			const pieData = d3
				.pie()
				.value(d => d[1])
				.sort(null)(entries)
			const arcGenerator = d3
				.arc()
				.innerRadius(r / 2)
				.outerRadius(r)
				.cornerRadius(3)
			const outerArcGenerator = d3
				.arc()
				.innerRadius(0.9 * r)
				.outerRadius(0.9 * r)

			const g = svg.select('.pie-container').attr('transform', `translate(${width / 2}, ${height / 2 + marginTop})`)
			const tooltipText = d => {
				return `${d.data[0]}: ${d.data[1].toFixed(2)}€`
			}
			g.selectAll(`.slice-${type}`)
				.data(pieData)
				.join('path')
				.attr('class', `slice-${type}`)
				.attr('d', arcGenerator)
				.attr('fill', d => colorScale(d.data[0]))
				.attr('stroke', 'white')
				.style('stroke-width', '1px')
				.attr('data-tippy-content', tooltipText)

			const tippys = tippy(`.slice-${type}`, {
				allowHTML: true,
				arrow: false,
				animation: false
			})

			if (width > 370) {
				const midangle = d => d.startAngle + (d.endAngle - d.startAngle) / 2

				g.selectAll('.label-line')
					.data(pieData)
					.join('polyline')
					.attr('class', 'label-line')
					.attr('stroke', 'black')
					.style('fill', 'none')
					.attr('stroke-width', 1)
					.attr('points', d => {
						let posA = arcGenerator.centroid(d)
						let posB = outerArcGenerator.centroid(d)
						let posC = outerArcGenerator.centroid(d)
						posC[0] = r * 1.01 * (midangle(d) < Math.PI ? 1 : -1)
						return [posA, posB, posC]
					})

				const pieLabel = function (className, text, dy) {
					g.selectAll(`.${className}`)
						.data(pieData)
						.join('text')
						.attr('class', className)
						.text(text)
						.attr('transform', d => {
							let pos = outerArcGenerator.centroid(d)
							pos[0] = r * 1.02 * (midangle(d) < Math.PI ? 1 : -1)
							return `translate(${pos})`
						})
						.style('text-anchor', d => (midangle(d) < Math.PI ? 'start' : 'end'))
						.attr('dy', dy)
				}

				pieLabel('first-row', d => d.data[0].split(' ')[0], '0.3em')
				pieLabel('second-row', d => d.data[0].split(' ').slice(1).join(' '), '1.2em')
			}

			g.selectAll('.sum')
				.data([total])
				.join('text')
				.attr('class', 'sum')
				.text(d => `${d.toFixed(2)}€`)
				.attr('x', 0)
				.attr('y', 0)
				.attr('text-anchor', 'middle')
				.attr('dy', '0.3em')
				.style('font-family', 'Roboto')
				.style('font-size', `${0.15 * r}px`)

			svg
				.select('.title')
				.text(title)
				.attr('x', width / 2)
				.attr('y', 30)

			return () => {
				tippys.forEach(item => {
					item.destroy()
				})
			}
		}
	}, [dataset, dimensions, title, total, sortSlices, type, tippys])

	const fetching = useSelector(state => state.transactions.fetching)

	return (
		<div className={className} ref={containerRef} style={{ position: 'relative', zIndex: 1 }}>
			{fetching && (
				<LoadingScreen
					style={{
						color: 'black',
						width: 50,
						height: 50,
						position: 'absolute',
						top: '50%',
						marginTop: -25
					}}
					classes='flex-center'
				/>
			)}
			<svg width='100%' height='100%' ref={svgRef}>
				<g className='pie-container' />
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
