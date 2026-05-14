'use client'

import { gaugeCalculate } from '@/utils/helpers/gaugeCalculate'

import { PanelProps } from '../PanelProps.interface'

import { Indication } from './Indication'

const Cpu = ({ info: arr }: PanelProps) => {
	const info = arr as number[]

	const usage = info.at(-1) || 0

	const {
		size,
		radius,
		strokeWidth,
		arcLength,
		fullCircumference,
		progressOffset
	} = gaugeCalculate({ usage })

	return (
		<div className='relative flex h-full w-full flex-col items-center'>
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
					{info.at(-1) || 0}%
				</div>
			</div>

			<Indication usage={usage} />
		</div>
	)
}

export { Cpu }
