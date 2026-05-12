import { LayoutItem } from 'react-grid-layout'

// TODO: заменить union на const object + typeof для именованных констант. С ними работать легче и код становиться более явным и читаемым.
export type PanelBlockType =
	| 'count-get'
	| 'avg-duration'
	| 'req-per-sec'
	| 'req-with-err'
	| 'cpu'
	| 'memory'
	| 'disk'

export interface PanelBlock {
	type: PanelBlockType
	info: any[]
}

export type LayoutItemGrid = LayoutItem & PanelBlock
