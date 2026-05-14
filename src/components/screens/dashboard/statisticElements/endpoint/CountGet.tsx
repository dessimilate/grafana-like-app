'use client'

import { usePanelStore } from '@/store/usePanelsStore'

import { PanelProps } from '../PanelProps.interface'

const CountGet = ({ info: arr }: PanelProps) => {
	const info = arr as number[]

	const { periodTime, refreshTime } = usePanelStore(
		state => state.panels[state.currentPanelName]
	)

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Get Requests Count</h2>
			<div className='grid h-full w-full flex-1 grid-cols-1 grid-rows-2 gap-4 py-2'>
				<div className='flex flex-col items-center justify-center border p-1'>
					<h3>AVG Requests</h3>
					<p>{(info.reduce((a, b) => a + b, 0) / info.length).toFixed(2)}</p>
				</div>

				<div className='flex flex-col items-center justify-center border'>
					<h3>Requests in Period</h3>
					<p>
						{info
							.slice(info.length - Math.round((periodTime * 60) / refreshTime))
							.reduce((a, b) => a + b, 0)}
					</p>
				</div>
			</div>
		</div>
	)
}

export { CountGet }
