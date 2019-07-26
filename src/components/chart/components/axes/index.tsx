import React from 'react'
import { ChartChildrenProps } from '../../'
import styles from './styles.module.css'

export function Axes({ width, height, centerX, centerY }: ChartChildrenProps) {
  return (
    <g>
      <line
        className={styles.axis}
        x1={0}
        y1={centerY}
        x2={width}
        y2={centerY}
      />
      <line
        className={styles.axis}
        x1={centerX}
        y1={0}
        x2={centerX}
        y2={height}
      />
    </g>
  )
}
