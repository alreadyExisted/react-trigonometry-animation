import * as d3 from 'd3'
import { Selection, ChartOptions, ChartType } from './interfaces'

const START_CIRCLE_ANGLE = 270
const START_GROUP_ANGLE = 315

export class Chart {
  private _svg!: Selection<SVGSVGElement>
  private _internalGroup!: Selection<SVGGElement>
  private _trace!: Selection<SVGPathElement>
  private _opts!: ChartOptions
  private _width!: number
  private _height!: number
  private _centerX!: number
  private _centerY!: number
  private _centerR!: number
  private _circleAngle!: number
  private _groupAngle!: number
  private _traceAngle!: number
  private _tracePoits!: string

  constructor(element: HTMLDivElement | null, opts: ChartOptions) {
    this._initSvg(element, opts)
    this._initAxes()
    this._initCircles()
    this._move()
  }

  animate() {
    this._circleAngle += 1
    this._groupAngle += this._opts.type === ChartType.Deltoid ? 2 : 3
    this._traceAngle -= 1

    if (this._groupAngle === 360) this._groupAngle = 0
    if (this._circleAngle === 360) this._circleAngle = 0
    if (this._traceAngle === -360) {
      this._traceAngle = 0
      this._tracePoits = ''
    }

    this._move()
  }

  private _initSvg(element: HTMLDivElement | null, opts: ChartOptions) {
    this._opts = opts
    this._width = 600
    this._height = 400
    this._centerX = this._width / 2
    this._centerY = this._height / 2
    this._centerR = this._width / 4
    this._circleAngle = START_CIRCLE_ANGLE
    this._groupAngle = START_GROUP_ANGLE
    this._traceAngle = 0
    this._tracePoits = ''

    d3.select(element)
      .append('div')
      .attr('class', 'title')
      .html(opts.title)

    this._svg = d3
      .select(element)
      .append('svg')
      .attr('class', 'chart')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${this._width} ${this._height}`)
  }

  private _initAxes() {
    const group = this._svg.append('g').attr('class', 'axes')

    group
      .append('line')
      .attr('class', 'axis')
      .attr('x1', 0)
      .attr('y1', this._centerY)
      .attr('x2', this._width)
      .attr('y2', this._centerY)

    group
      .append('line')
      .attr('class', 'axis')
      .attr('x1', this._centerX)
      .attr('y1', 0)
      .attr('x2', this._centerX)
      .attr('y2', this._height)
  }

  private _initCircles() {
    const group = this._svg.append('g').attr('class', 'circles')

    group
      .append('circle')
      .attr('class', 'circle')
      .attr('r', this._centerR)
      .attr('cx', this._centerX)
      .attr('cy', this._centerY)

    this._trace = group.append('path').attr('class', 'trace')

    this._internalGroup = group.append('g').attr('class', 'internal-group')

    const r = this._centerR / this._opts.type
    const deltaR = this._opts.type === ChartType.Deltoid ? r - 15 : r - 10

    this._internalGroup
      .append('circle')
      .attr('class', 'circle circle--inner')
      .attr('r', r)

    this._internalGroup
      .append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', deltaR)
      .attr('y2', deltaR)

    this._internalGroup
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3)

    this._internalGroup
      .append('circle')
      .attr('class', 'dot dot--red')
      .attr('r', 3)
      .attr('cx', deltaR)
      .attr('cy', deltaR)
  }

  private _move() {
    const circleAngle = this._circleAngle * (Math.PI / 180)
    const traceAngle = this._traceAngle * (Math.PI / 180)

    const r = this._centerR / this._opts.type

    const circleX = this._centerX - Math.sin(circleAngle) * (this._centerR - r)
    const circleY = this._centerY - Math.cos(circleAngle) * (this._centerR - r)

    const b = this._centerR
    const a = b / this._opts.type

    const x =
      (b - a) * Math.cos(traceAngle) +
      a * Math.cos(((b - a) / a) * traceAngle) +
      this._centerX
    const y =
      (b - a) * Math.sin(traceAngle) -
      a * Math.sin(((b - a) / a) * traceAngle) +
      this._centerY

    this._tracePoits += `${this._tracePoits ? 'L' : 'M'}${x},${y}`

    this._trace.attr('d', this._tracePoits)

    this._internalGroup.attr(
      'transform',
      `translate(${circleX}, ${circleY}) rotate(${this._groupAngle})`
    )
  }
}
