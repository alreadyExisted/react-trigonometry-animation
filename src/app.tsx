import React from 'react'
import styles from './styles.module.css'
import { Chart, ChartType } from './components/chart'

export function App() {
  return (
    <div className={styles.wrap}>
      <Chart title="Deltoid" type={ChartType.Deltoid} />
      <Chart title="Astroid" type={ChartType.Astroid} />
    </div>
  )
}
