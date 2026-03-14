import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { TestEntry } from '@/types/test'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTimestamp } from '@/lib/test-utils'

interface TrendChartProps {
  tests: TestEntry[]
}

export function TrendChart({ tests }: TrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || tests.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 50, left: 50 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const sortedTests = [...tests].reverse()

    const x = d3.scaleTime()
      .domain(d3.extent(sortedTests, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0])

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('fill', 'oklch(0.50 0.02 240)')
      .style('font-family', 'Space Grotesk, sans-serif')

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('fill', 'oklch(0.50 0.02 240)')
      .style('font-family', 'JetBrains Mono, monospace')

    g.selectAll('.domain, .tick line')
      .style('stroke', 'oklch(0.88 0.01 240)')

    const line = d3.line<TestEntry>()
      .x(d => x(new Date(d.timestamp)))
      .y(d => y(d.score))
      .curve(d3.curveMonotoneX)

    const path = g.append('path')
      .datum(sortedTests)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.45 0.15 250)')
      .attr('stroke-width', 3)
      .attr('d', line)

    const totalLength = path.node()?.getTotalLength() || 0
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', 'oklch(1 0 0)')
      .style('border', '1px solid oklch(0.88 0.01 240)')
      .style('border-radius', '0.5rem')
      .style('padding', '0.75rem')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)')
      .style('z-index', '1000')
      .style('font-family', 'Space Grotesk, sans-serif')

    g.selectAll('.dot')
      .data(sortedTests)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(new Date(d.timestamp)))
      .attr('cy', d => y(d.score))
      .attr('r', 0)
      .attr('fill', 'oklch(0.62 0.18 200)')
      .attr('stroke', 'oklch(1 0 0)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .delay((_, i) => i * 100 + 1000)
      .duration(300)
      .attr('r', 6)

    g.selectAll('.dot')
      .on('mouseenter', function(event: MouseEvent, d: unknown) {
        const test = d as TestEntry
        d3.select(this as SVGCircleElement)
          .transition()
          .duration(200)
          .attr('r', 8)
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${test.name}</div>
            <div style="font-family: JetBrains Mono, monospace; font-size: 1.25rem; font-weight: 700; color: oklch(0.45 0.15 250); margin-bottom: 0.25rem;">${test.score}%</div>
            <div style="font-size: 0.875rem; color: oklch(0.50 0.02 240);">${formatTimestamp(test.timestamp)}</div>
          `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseleave', function() {
        d3.select(this as SVGCircleElement)
          .transition()
          .duration(200)
          .attr('r', 6)
        
        tooltip.style('opacity', 0)
      })

    return () => {
      tooltip.remove()
    }
  }, [tests])

  if (tests.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Score Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Add tests to see your performance trend</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} width="100%" height="300" />
      </CardContent>
    </Card>
  )
}
