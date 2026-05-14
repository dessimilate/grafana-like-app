'use client'

import {
	InfoType,
	PANEL_BLOCK_TYPES_STATIC,
	PanelBlockType
} from '@/types/LayoutItemGrid.type'

import { usePanelStore } from '@/store/usePanelsStore'

import { AvgDuration } from './endpoint/AvgDuration'
import { Chart } from './endpoint/Chart'
import { CountGet } from './endpoint/CountGet'
import { Cpu } from './gauge/Cpu'
import { Disk } from './gauge/Disk'
import { Memory } from './gauge/Memory'

export interface StatisticElementProps {
	i: string
	type: PanelBlockType
}

export interface SwitchElementProps {
	type: PanelBlockType
	info: InfoType[]
}

const StatisticElement = ({ i, type }: StatisticElementProps) => {
	const isStatic = type in PANEL_BLOCK_TYPES_STATIC
	const info = usePanelStore(state => {
		const currentPanel = state.panels[state.currentPanelName]
		const metrics = currentPanel.metrics
		if (isStatic) {
			return metrics.static[i] || []
		}
		return metrics.endpoints[currentPanel.layout.currentEndpoint][i] || []
	})

	return (
		<div className='flex h-full w-full items-center justify-center p-4'>
			<SwitchElement
				type={type}
				info={info}
			/>
		</div>
	)
}

const SwitchElement = ({ type, info }: SwitchElementProps) => {
	switch (type) {
		case 'count-get':
			return <CountGet info={info} />
		case 'avg-duration':
			return <AvgDuration info={info} />
		case 'req-per-sec':
			return (
				<Chart
					info={info}
					type='per-sec'
				/>
			)
		case 'req-with-err':
			return (
				<Chart
					info={info}
					type='with-err'
				/>
			)
		case 'cpu':
			return <Cpu info={info} />
		case 'memory':
			return <Memory info={info} />
		case 'disk':
			return <Disk info={info} />
	}
}

export { StatisticElement }
