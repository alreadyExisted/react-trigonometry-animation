import * as d3 from 'd3'

export type Selection<T extends d3.BaseType> = d3.Selection<
  T,
  unknown,
  null,
  undefined
>

export enum ChartType {
  Deltoid = 3,
  Astroid = 4
}

export interface ChartOptions {
  type: ChartType
  title: string
}
