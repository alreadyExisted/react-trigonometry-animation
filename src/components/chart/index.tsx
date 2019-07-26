import React, { ReactNode, useMemo } from 'react'
import { Axes } from './components/axes'
import { Circles } from './components/circles'
import styles from './styles.module.css'

const CHART_WIDTH = 600
const CHART_HEIGHT = 400

export enum ChartType {
  Deltoid = 3,
  Astroid = 4
}

export interface ChartChildrenProps {
  width: number
  height: number
  centerX: number
  centerY: number
  centerR: number
}

interface OwnProps {
  title: ReactNode
  type: ChartType
}

export function Chart({ title, type }: OwnProps) {
  const props: ChartChildrenProps = useMemo(() => {
    return {
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      centerX: CHART_WIDTH / 2,
      centerY: CHART_HEIGHT / 2,
      centerR: CHART_WIDTH / 4
    }
  }, [])

  return (
    <>
      <div className={styles.title}>{title}</div>
      <svg
        className={styles.chart}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="xMinYMin meet"
      >
        <Axes {...props} />
        <Circles type={type} {...props} />
      </svg>
    </>
  )
}
