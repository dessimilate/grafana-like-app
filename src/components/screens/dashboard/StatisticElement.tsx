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
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'

import { LayoutItemGrid, PanelBlockType } from '@/types/grid-layout.type'
import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

import { minMax } from '@/utils/funcs/min-max'
import { getRandomInt } from '@/utils/funcs/random-number'

ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Tooltip,
	Legend,
	streamingPlugin
)

interface StatisticElementProps {
	item: LayoutItemGrid
}

interface SwitchElementProps {
	type: PanelBlockType
	item: LayoutItemGrid
}

interface PanelProps {
	item: LayoutItemGrid
}

const maxMemory = 65536

const StatisticElement: NextComponentType<StatisticElementProps> = ({
	item
}) => {
	const { type, info } = item

	const {
		currentPanel: { periodTime, refreshTime },
		changeInfo
	} = usePanelStore()

	const [interv, setInterv] = useState<NodeJS.Timeout>()

	useEffect(() => {
		clearInterval(interv)

		const count = Math.floor((periodTime * 60) / refreshTime) * 2

		const newTimer = setInterval(() => {
			if (type === 'count-get') {
				const reqCount = getRandomInt(1, 20)

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(reqCount)

				changeInfo(item.i, updatedInfo)
			}

			if (type === 'avg-duration') {
				const avgDuration = getRandomInt(10, 300)

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(avgDuration)

				changeInfo(item.i, updatedInfo)
			}

			if (type === 'req-per-sec') {
				const reqPerSec = getRandomInt(40, 70)

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(reqPerSec)

				changeInfo(item.i, updatedInfo)
			}

			if (type === 'req-with-err') {
				const reqWithErr = getRandomInt(2, 6)

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(reqWithErr)

				changeInfo(item.i, updatedInfo)
			}

			if (type === 'cpu') {
				const percent = getRandomInt(-7, 7)

				const lastElement = info.at(-1) || 50

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(minMax(percent + lastElement, 0, 100))

				changeInfo(item.i, updatedInfo)
			}

			if (type === 'memory') {
				const mem = getRandomInt(-0.07 * maxMemory, 0.07 * maxMemory)

				const lastElement = info.at(-1) || maxMemory / 2

				const updatedInfo = [...info]

				if (updatedInfo.length > count) updatedInfo.shift()
				updatedInfo.push(minMax(mem + lastElement, 0, maxMemory))

				changeInfo(item.i, updatedInfo)
			}
		}, refreshTime * 1000)

		setInterv(newTimer)
	}, [periodTime, refreshTime, item])

	return (
		<div className='flex h-full w-full items-center justify-center p-4'>
			<SwitchElement
				type={type}
				item={item}
			/>
		</div>
	)
}

const SwitchElement: NextComponentType<SwitchElementProps> = ({
	type,
	item
}) => {
	switch (type) {
		case 'count-get':
			return <CountGet item={item} />
		case 'avg-duration':
			return <AvgDuration item={item} />
		case 'req-per-sec':
			return <ReqPerSec item={item} />
		case 'req-with-err':
			return <ReqWithErr item={item} />
		case 'cpu':
			return <Cpu item={item} />
		case 'memory':
			return <Memory item={item} />
	}
}

const CountGet: NextComponentType<PanelProps> = ({ item }) => {
	const {
		currentPanel: { periodTime, refreshTime }
	} = usePanelStore()

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Get Requests Count</h2>
			<div className='grid h-full w-full flex-1 grid-cols-1 grid-rows-2 gap-4 py-2'>
				<div className='flex flex-col items-center justify-center border p-1'>
					<h3>AVG Requests</h3>
					<p>
						{(item.info.reduce((a, b) => a + b, 0) / item.info.length).toFixed(
							2
						)}
					</p>
				</div>

				<div className='flex flex-col items-center justify-center border'>
					<h3>Requests in Period</h3>
					<p>
						{item.info
							.slice(
								item.info.length - Math.round((periodTime * 60) / refreshTime)
							)
							.reduce((a, b) => a + b, 0)}
					</p>
				</div>
			</div>
		</div>
	)
}

const AvgDuration: NextComponentType<PanelProps> = ({ item }) => {
	const minValue = 10
	const maxValue = 300

	const coefficient = 0.9

	const avg = +(
		item.info.slice(item.info.length - 15).reduce((res, el) => res + el, 0) / 15
	).toFixed()
	const avgPercent = Math.round(
		(avg / (maxValue * coefficient - minValue)) * 100
	)

	const max = item.info
		.slice(item.info.length - 10)
		.reduce((res, el) => Math.max(res, el), 0)
	const maxPercent = Math.round((max / (maxValue + minValue * 6)) * 100)

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Response Duration</h2>
			<div className='grid h-full w-full flex-1 grid-cols-1 grid-rows-2 gap-4 py-2'>
				<div className='flex flex-col'>
					<h3>AVG Duration</h3>
					<div className='grid flex-1 grid-cols-[1fr_6rem] items-center'>
						<div className='relative h-full flex-1'>
							<motion.div
								animate={{
									mask: `linear-gradient(to right, black ${avgPercent}%, transparent ${avgPercent}%)`
								}}
								className='absolute top-0 left-0 h-full w-full'
							>
								<div className='mask-rect-repeat h-full w-full flex-1 bg-linear-to-r from-green-600 to-red-600 p-1'></div>
							</motion.div>
							<motion.div className='absolute top-0 left-0 h-full w-full'>
								<div className='mask-rect-repeat h-full w-full flex-1 bg-linear-to-r from-green-600/40 to-red-600/40 p-1'></div>
							</motion.div>
						</div>
						<div className='pl-4 text-2xl'>{avg}ms</div>
					</div>
				</div>

				<div className='flex flex-col'>
					<h3>Max Duration in Period</h3>
					<div className='grid flex-1 grid-cols-[1fr_6rem] items-center'>
						<div className='relative h-full flex-1'>
							<motion.div
								animate={{
									mask: `linear-gradient(to right, black ${maxPercent}%, transparent ${maxPercent}%)`
								}}
								className='absolute top-0 left-0 h-full w-full'
							>
								<div className='mask-rect-repeat h-full w-full flex-1 bg-linear-to-r from-green-600 to-red-600 p-1'></div>
							</motion.div>
							<motion.div className='absolute top-0 left-0 h-full w-full'>
								<div className='mask-rect-repeat h-full w-full flex-1 bg-linear-to-r from-green-600/40 to-red-600/40 p-1'></div>
							</motion.div>
						</div>
						<div className='pl-4 text-2xl'>{max}ms</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ReqPerSec: NextComponentType<PanelProps> = ({ item }) => {
	const {
		currentPanel: { periodTime, refreshTime }
	} = usePanelStore()

	const chartRef = useRef<any>(null)

	const duration = periodTime * 20 * 1000

	const dataRef = useRef({
		datasets: [
			{
				label: 'Requests Per Second',
				borderColor: '#3b82f6',
				borderWidth: 2,
				pointRadius: 0,
				data: []
			}
		]
	})

	const options: any = {
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
						const lastValue =
							item.info.length > 0 ? item.info[item.info.length - 1] : 0

						chart.data.datasets[0].data.push({
							x: Date.now(),
							y: lastValue
						})
					}
				}
			},
			y: {
				min: 0,
				max: 80
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	}

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Requests Per Second</h2>
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

const ReqWithErr: NextComponentType<PanelProps> = ({ item }) => {
	const {
		currentPanel: { periodTime, refreshTime }
	} = usePanelStore()

	const chartRef = useRef<any>(null)

	const duration = periodTime * 20 * 1000

	const dataRef = useRef({
		datasets: [
			{
				label: 'Requests Per Second',
				borderColor: '#e03154',
				borderWidth: 2,
				pointRadius: 0,
				data: []
			}
		]
	})

	const options: any = {
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
						const lastValue =
							item.info.length > 0 ? item.info[item.info.length - 1] : 0

						chart.data.datasets[0].data.push({
							x: Date.now(),
							y: lastValue
						})
					}
				}
			},
			y: {
				min: 0,
				max: 7
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	}

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Requests With Error</h2>
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

const Cpu: NextComponentType<PanelProps> = ({ item }) => {
	const size = 220
	const strokeWidth = 18
	const radius = (size - strokeWidth) / 2

	const fullCircumference = 2 * Math.PI * radius

	const arcLength = fullCircumference * 0.75

	const usage = item.info.at(-1) || 0

	const progressOffset = arcLength - (usage / 100) * arcLength

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>CPU Usage</h2>
			<div className='relative flex h-full w-full flex-1 items-center justify-center gap-4 py-2'>
				<svg
					viewBox={`0 0 ${size} ${size}`}
					className='h-full w-auto rotate-[-225deg]'
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='none'
						className='stroke-graph'
						strokeWidth={strokeWidth}
						strokeDasharray={`${arcLength} ${fullCircumference}`}
						strokeLinecap='round'
					/>

					{/* Active **/}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='none'
						strokeWidth={strokeWidth}
						strokeDasharray={`${arcLength} ${fullCircumference}`}
						strokeDashoffset={progressOffset}
						strokeLinecap='round'
						className='stroke-blue-500 transition-all duration-700 ease-out'
					/>
				</svg>

				<div className='absolute bottom-10 left-1/2 -translate-x-1/2 transform text-2xl'>
					{item.info.length > 0 ? item.info[item.info.length - 1] : 0}%
				</div>
			</div>
		</div>
	)
}

const Memory: NextComponentType<PanelProps> = ({ item }) => {
	const size = 220
	const strokeWidth = 18
	const radius = (size - strokeWidth) / 2

	const fullCircumference = 2 * Math.PI * radius

	const arcLength = fullCircumference * 0.75

	const usage = Math.round(((item.info.at(-1) || 0) / maxMemory) * 100)

	const progressOffset = arcLength - (usage / 100) * arcLength

	return (
		<div className='flex h-full w-full flex-col items-center'>
			<h2>Memory Usage</h2>
			<div className='relative flex h-full w-full flex-1 items-center justify-center gap-4 py-2'>
				<svg
					viewBox={`0 0 ${size} ${size}`}
					className='h-full w-auto rotate-[-225deg]'
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='none'
						className='stroke-graph'
						strokeWidth={strokeWidth}
						strokeDasharray={`${arcLength} ${fullCircumference}`}
						strokeLinecap='round'
					/>

					{/* Active **/}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='none'
						strokeWidth={strokeWidth}
						strokeDasharray={`${arcLength} ${fullCircumference}`}
						strokeDashoffset={progressOffset}
						strokeLinecap='round'
						className='stroke-green-500 transition-all duration-700 ease-out'
					/>
				</svg>

				<div className='absolute bottom-10 left-1/2 flex -translate-x-1/2 transform flex-col items-center text-2xl'>
					<span>{(item.info.at(-1) / 1024).toFixed(2)}gb</span>
					<span>{usage}%</span>
				</div>
			</div>
		</div>
	)
}

export { StatisticElement }
