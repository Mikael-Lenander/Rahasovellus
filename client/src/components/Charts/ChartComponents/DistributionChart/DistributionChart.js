import React, { useRef, useEffect } from 'react'
import useResizeObserver from '../../../../hooks/useResizeObserver'
import * as d3 from 'd3'
import '../ChartComponents.css'

export default function DistributionChart({ dataset, type, onSetSvgHeight }) {
	const svgRef = useRef()
	const containerRef = useRef(null)
	const dimensions = useResizeObserver(containerRef)

	useEffect(() => {
		if (dimensions && dataset.length > 0) {
			const svg = d3.select(svgRef.current)
			const width = dimensions.width
			const height = dimensions.height

			const keys = Object.keys(dataset[dataset.length - 1]).filter(key => key !== 'date' && dataset[dataset.length - 1][key] > 0)
			const legendSize = 18
			const legendMargin = 10
			const legendTopMargin = 25
			const legendsPerRow = Math.floor(width / 200)
			const legendHeight = legendTopMargin + (legendSize + legendMargin) * Math.ceil(keys.length / legendsPerRow)
			onSetSvgHeight(width, legendHeight)

			const margin = {
				left: 20 + width / 20,
				right: 20,
				top: 20,
				bottom: legendHeight,
			}
			const innerWidth = width - margin.left - margin.right
			const innerHeight = height - margin.top - margin.bottom

			const series = d3.stack().keys(keys).offset(d3.stackOffsetExpand)(dataset)

			const xScale = d3
				.scaleTime()
				.domain(d3.extent(dataset, d => new Date(d.date)))
				.range([margin.left, margin.left + innerWidth])
			const yScale = d3.scaleLinear().range([margin.top + innerHeight, margin.top])
			const colorScale = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10.slice(0, keys.length))

			const areaGenerator = d3
				.area()
				.x(d => xScale(new Date(d.data.date)))
				.y0(d => yScale(d[0]))
				.y1(d => yScale(d[1]))
				.curve(d3.curveBasis)

			svg
				.selectAll(`.${type}-distribution-area`)
				.data(series)
				.join('path')
				.attr('class', `${type}-distribution-area`)
				.attr('fill', ({ key }) => colorScale(key))
				.attr('d', areaGenerator)

			const yAxis = d3
				.axisLeft()
				.scale(yScale)
				.ticks(Math.floor(height / 50))
				.tickFormat(d3.format('.0%'))
			const xAxis = d3
				.axisBottom()
				.scale(xScale)
				.ticks(Math.floor(width / 100))
			const yAxisTickSize = 6 + width / 80

			svg.select('.y-axis').attr('transform', `translate(${margin.left}, 0)`).style('font-size', `${yAxisTickSize}px`).call(yAxis)

			svg
				.select('.x-axis')
				.attr('transform', `translate(0, ${margin.top + innerHeight})`)
				.style('font-size', '13px')
				.call(xAxis)
			const legendY = idx => margin.top + innerHeight + legendTopMargin + (legendSize + legendMargin) * Math.floor(idx / legendsPerRow)
			const legendX = idx => margin.left + (innerWidth / legendsPerRow) * (idx % legendsPerRow)

			svg
				.selectAll('.legend-rect')
				.data(keys)
				.join('rect')
				.attr('class', 'legend-rect')
				.attr('width', legendSize)
				.attr('height', legendSize)
				.attr('fill', d => colorScale(d))
				.attr('y', (_, idx) => legendY(idx))
				.attr('x', (_, idx) => legendX(idx))

			svg
				.selectAll('.legend-text')
				.data(keys)
				.join('text')
				.attr('class', 'legend-text')
				.attr('y', (_, idx) => legendY(idx) + (3 / 4) * legendSize)
				.attr('x', (_, idx) => legendX(idx) + 1.2 * legendSize)
				.text(d => d)
				.attr('text-anchor', 'left')
				.style('alignment-baseline', 'middle')
		}
	}, [dataset, dimensions, type, onSetSvgHeight])

	return (
		<div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
			<svg width='100%' height='100%' ref={svgRef}>
				<text className='title'></text>
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
