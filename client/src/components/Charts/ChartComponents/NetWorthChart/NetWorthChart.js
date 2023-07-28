import React, { useRef, useEffect } from 'react'
import useResizeObserver from '../../../../hooks/useResizeObserver'
import * as d3 from 'd3'
import '../ChartComponents.css'

export default function NetWorthChart({ dataset, onSetSvgHeight }) {
	const svgRef = useRef()
	const containerRef = useRef(null)
	const dimensions = useResizeObserver(containerRef)

	useEffect(() => {
		if (dimensions && dataset.length > 0) {
			const svg = d3.select(svgRef.current)
			const width = dimensions.width
			const height = dimensions.height
			const margin = { left: 30 + width / 12, right: 20, top: 40, bottom: 40 }
			const innerWidth = width - margin.left - margin.right
			const innerHeight = height - margin.top - margin.bottom
			const [minValue, maxValue] = d3.extent(dataset, d => d.capital)
			onSetSvgHeight(width, 75)

			const yScale = d3
				.scaleLinear()
				.domain([Math.min(0, minValue), maxValue])
				.range([margin.top + innerHeight, margin.top])
			const xScale = d3
				.scaleTime()
				.domain(d3.extent(dataset, d => new Date(d.date)))
				.range([margin.left, margin.left + innerWidth])

			const yAxis = d3
				.axisLeft()
				.scale(yScale)
				.ticks(Math.floor(height / 50))
			const xAxis = d3
				.axisBottom()
				.scale(xScale)
				.ticks(Math.floor(width / 100))

			const posArea = d3
				.area()
				.x(d => xScale(new Date(d.date)))
				.y0(() => yScale(0))
				.y1(d => yScale(Math.max(d.capital, 0)))
				.curve(d3.curveBasis)
			const negArea = d3
				.area()
				.x(d => xScale(new Date(d.date)))
				.y0(() => yScale(0))
				.y1(d => yScale(Math.min(d.capital, 0)))
				.curve(d3.curveBasis)

			svg.select('#positive-networth-area').attr('d', posArea(dataset))
			svg.select('#negative-networth-area').attr('d', negArea(dataset))

			const yAxisTickSize = 6 + width / 80
			svg.select('.y-axis').attr('transform', `translate(${margin.left}, 0)`).style('font-size', `${yAxisTickSize}px`).call(yAxis)

			svg
				.select('.x-axis')
				.attr('transform', `translate(0, ${margin.top + innerHeight})`)
				.style('font-size', '13px')
				.call(xAxis)

			const yAxisLabelSize = 10 + width / 60
			svg
				.select('.y-axis-label')
				.attr('y', margin.left / 2.5 - yAxisLabelSize / 2)
				.attr('x', -height / 2)
				.style('font-size', `${yAxisLabelSize}px`)
				.attr('text-anchor', 'middle')
				.attr('vertical-align', 'middle')
				.attr('transform', 'rotate(-90)')
				.text('Net worth')

			return () => {}
		}
	}, [dataset, dimensions, onSetSvgHeight])

	return (
		<div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
			<svg width='100%' height='100%' ref={svgRef}>
				<text className='title'></text>
				<text className='y-axis-label'></text>
				<path id='positive-networth-area' className='networth-area'></path>
				<path id='negative-networth-area' className='networth-area'></path>
				<g className='x-axis' />
				<g className='y-axis' />
			</svg>
			{dataset.length < 2 && (
				<div className='flex-center blank-page'>
					<h2 style={{ fontFamily: 'Arial', fontSize: 22 }}>Not enough data</h2>
				</div>
			)}
		</div>
	)
}
