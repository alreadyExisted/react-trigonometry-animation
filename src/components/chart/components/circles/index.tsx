import React, { useMemo, useEffect, useState } from 'react'
import { ChartChildrenProps, ChartType } from '../../'
import styles from './styles.module.css'

const DOT_RADIUS = 3
const DELTOID_RADIUS_DELTA = 15
const OTHER_RADIUS_DELTA = 10
const SPEED = 10
const DEFAULT_START_ANGLE = 0
const DEFAULT_END_ANGLE = 360
const DEFAULT_CIRCLE_ANGLE = 270
const DEFAULT_GROUP_ANGLE = 315
const DEFAULT_TRACE_PATH = ''

interface OwnProps extends ChartChildrenProps {
  type: ChartType
}

export function Circles({ type, centerX, centerY, centerR }: OwnProps) {
  const internalCircleProps: InternalGroupProps = useMemo(() => {
    const r = centerR / type
    return {
      type,
      centerX,
      centerY,
      centerR,
      r,
      deltaR:
        type === ChartType.Deltoid
          ? r - DELTOID_RADIUS_DELTA
          : r - OTHER_RADIUS_DELTA
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <g>
      <circle className={styles.circle} r={centerR} cx={centerX} cy={centerY} />
      <InternalGroup {...internalCircleProps} />
    </g>
  )
}

interface InternalGroupProps extends Omit<OwnProps, 'width' | 'height'> {
  r: number
  deltaR: number
}

function InternalGroup({
  type,
  centerX,
  centerY,
  centerR,
  r,
  deltaR
}: InternalGroupProps) {
  const [_circleAngle, setCircleAngle] = useState(DEFAULT_CIRCLE_ANGLE)
  const [groupAngle, setGroupAngle] = useState(DEFAULT_GROUP_ANGLE)
  const [_traceAngle, setTraceAngle] = useState(DEFAULT_START_ANGLE)
  const [tracePath, setTracePath] = useState(DEFAULT_TRACE_PATH)

  const groupProps = useMemo(() => {
    const angle = _circleAngle * (Math.PI / 180)
    const r = centerR / type
    return {
      circleX: centerX - Math.sin(angle) * (centerR - r),
      circleY: centerY - Math.cos(angle) * (centerR - r)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_circleAngle])
  const traceProps = useMemo(() => {
    const angle = _traceAngle * (Math.PI / 180)
    const b = centerR
    const a = b / type
    return {
      x:
        (b - a) * Math.cos(angle) +
        a * Math.cos(((b - a) / a) * angle) +
        centerX,
      y:
        (b - a) * Math.sin(angle) -
        a * Math.sin(((b - a) / a) * angle) +
        centerY
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_traceAngle])

  useEffect(() => {
    const interval = setTimeout(() => {
      setCircleAngle(setData(1))
      setGroupAngle(setData(type === ChartType.Deltoid ? 2 : 3))
      setTraceAngle(setData(-1, -1))
      setTracePath(path => {
        if (_traceAngle - 1 === -DEFAULT_END_ANGLE) return DEFAULT_TRACE_PATH
        return `${path}${path ? 'L' : 'M'}${traceProps.x},${traceProps.y}`
      })
    }, SPEED)

    return () => {
      clearTimeout(interval)
    }
  }, [_traceAngle, traceProps.x, traceProps.y, type])

  return (
    <>
      <path className={styles.trace} d={tracePath} />
      <g
        transform={`
          translate(${groupProps.circleX}, ${groupProps.circleY})
          rotate(${groupAngle})
        `}
      >
        <circle className={styles.circleInternal} r={r} />
        <line className={styles.line} x1={0} y1={0} x2={deltaR} y2={deltaR} />
        <circle r={DOT_RADIUS} />
        <circle
          className={styles.dotRed}
          r={DOT_RADIUS}
          cx={deltaR}
          cy={deltaR}
        />
      </g>
    </>
  )
}

function setData(inc: number, abs: number = 1) {
  return (angle: number) => {
    angle += inc
    return angle === DEFAULT_END_ANGLE * abs ? DEFAULT_START_ANGLE : angle
  }
}
