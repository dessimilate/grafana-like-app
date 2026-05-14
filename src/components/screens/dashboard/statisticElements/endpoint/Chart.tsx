'use client'

import {
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	TimeScale,
	Tooltip
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import streamingPlugin from 'chartjs-plugin-streaming'
import { useEffect, useMemo, useRef } from 'react'
import { Line } from 'react-chartjs-2'

import { usePanelStore } from '@/store/usePanelsStore'

import { PanelProps } from '../PanelProps.interface'

ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Tooltip,
	Legend,
	streamingPlugin
)

interface ChartProps extends PanelProps {
	type: 'per-sec' | 'with-err'
}

const DURATION_CONSTANT = 20 * 1000

const Chart = ({ info: arr, type }: ChartProps) => {
	const info = arr as number[]

	const { periodTime, refreshTime } = usePanelStore(
		state => state.panels[state.currentPanelName]
	)

	const chartRef = useRef<any>(null)

	const duration = periodTime * DURATION_CONSTANT

	const dataRef = useRef({
		datasets: [
			{
				label:
					type === 'per-sec' ? 'Requests Per Second' : 'Requests With Errors',
				borderColor: type === 'per-sec' ? '#3b82f6' : '#e03154',
				borderWidth: 2,
				pointRadius: 0,
				data: [] as { x: number; y: number }[]
			}
		]
	})

	//chart config
	const options: any = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				x: {
					type: 'realtime',
					realtime: {
						duration,
						refresh: refreshTime * 1000,
						delay: 1000,
						onRefresh: (chart: any) => {
							const lastValue = info.length > 0 ? info[info.length - 1] : 0

							chart.data.datasets[0].data.push({
								x: Date.now(),
								y: lastValue
							})
						}
					}
				},
				y: {
					min: 0,
					max: type === 'per-sec' ? 80 : 7
				}
			},
			plugins: {
				legend: { display: false },
				tooltip: { enabled: false }
			},
			events: []
		}),
		[periodTime, refreshTime, info]
	)

	//set initial data
	useEffect(() => {
		const chart = chartRef.current
		if (!chart || !info?.length) return

		const now = Date.now()
		const interval = refreshTime * 1000

		const historicalData = info.map((value, index) => ({
			x: now - (info.length - 1 - index) * interval,
			y: value
		}))

		chart.data.datasets[0].data = historicalData

		chart.update('none')
	}, [refreshTime, info])

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>
				{type === 'per-sec' ? 'Requests Per Second' : 'Requests With Errors'}
			</h2>
			<div className='h-full w-full flex-1 gap-4 py-2'>
				<Line
					ref={chartRef}
					data={dataRef.current}
					options={options}
				/>
			</div>
		</div>
	)
}

export { Chart }
