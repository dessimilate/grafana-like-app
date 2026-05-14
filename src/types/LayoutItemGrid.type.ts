import { LayoutItem } from 'react-grid-layout'

export const PANEL_BLOCK_TYPES_STATIC = {
	cpu: 'cpu',
	memory: 'memory',
	disk: 'disk'
}

const PANEL_BLOCK_TYPES = {
	countGet: 'count-get',
	avgDuration: 'avg-duration',
	reqPerSec: 'req-per-sec',
	reqWithErr: 'req-with-err',
	...PANEL_BLOCK_TYPES_STATIC
} as const

export type PanelBlockType =
	(typeof PANEL_BLOCK_TYPES)[keyof typeof PANEL_BLOCK_TYPES]

export type DiskInfo = { percent: number; memory: number }
export type InfoType = number | DiskInfo

export interface PanelBlock {
	type: PanelBlockType
}

export type LayoutItemGrid = LayoutItem & PanelBlock
