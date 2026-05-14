'use client'

import { motion } from 'framer-motion'

import { ENDPOINT } from '@/constants/dataSimulation.constant'

import { PanelProps } from '../PanelProps.interface'

const AVG_LAST_ELEMENTS = 15
const MAX_LAST_ELEMENTS = 10
const LAST_ELEMENTS_NUMBER_COEFFICIENT = 0.9

const AvgDuration = ({ info: arr }: PanelProps) => {
	const info = arr as number[]

	const avg = +(
		info
			.slice(info.length - AVG_LAST_ELEMENTS)
			.reduce((acc, el) => acc + el, 0) / AVG_LAST_ELEMENTS
	).toFixed()

	const avgPercent = Math.round(
		(avg /
			(ENDPOINT.AVG_DURATION.MAX * LAST_ELEMENTS_NUMBER_COEFFICIENT -
				ENDPOINT.AVG_DURATION.MIN)) *
			100
	)

	const max = info
		.slice(info.length - MAX_LAST_ELEMENTS)
		.reduce((res, el) => Math.max(res, el), 0)

	const maxPercent = Math.round(
		(max / (ENDPOINT.AVG_DURATION.MAX + ENDPOINT.AVG_DURATION.MIN * 6)) * 100
	)

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

export { AvgDuration }
