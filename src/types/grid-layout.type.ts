import { LayoutItem } from 'react-grid-layout'

export type PanelBlockType =
	| 'count-get'
	| 'avg-duration'
	| 'req-per-sec'
	| 'req-with-err'

export interface PanelBlock {
	type: PanelBlockType
	info: any[]
}

export type LayoutItemGrid = LayoutItem & PanelBlock
