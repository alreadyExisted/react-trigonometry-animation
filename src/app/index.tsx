import React, { useRef, useEffect } from 'react'
import { Chart } from './chart'
import { ChartType } from './interfaces'
import './styles.css'

export function App() {
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const deltoid = new Chart(element.current, {
      type: ChartType.Deltoid,
      title: 'Deltoid'
    })
    const astroid = new Chart(element.current, {
      type: ChartType.Astroid,
      title: 'Astroid'
    })

    const interval = setInterval(() => {
      deltoid.animate()
      astroid.animate()
    }, 15)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div className="wrap" ref={element} />
}
