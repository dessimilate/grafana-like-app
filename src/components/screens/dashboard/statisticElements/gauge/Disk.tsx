'use client'

import { DiskInfo } from '@/types/LayoutItemGrid.type'

import { gaugeCalculate } from '@/utils/helpers/gaugeCalculate'

import { PanelProps } from '../PanelProps.interface'

import { Indication } from './Indication'

const Disk = ({ info: arr }: PanelProps) => {
	const info = arr as DiskInfo[]

	const usage = info.at(-1)?.percent || 0
	const freeDiskSpace = ((info.at(-1)?.memory || 0) / 1024).toFixed(2)

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
			<h2>Disk Info</h2>
			<div className='relative flex h-full w-full flex-1 items-center justify-center gap-4 py-2'>
				<svg
					viewBox={`0 0 ${size} ${size}`}
					className='z-10 h-full w-auto rotate-[-225deg]'
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
						className='stroke-yellow-900 transition-all duration-700 ease-out'
					/>
				</svg>

				<div className='absolute bottom-10 left-1/2 flex -translate-x-1/2 transform flex-col items-center text-2xl'>
					<span>Disk Usage:</span>
					<span>{usage}%</span>
				</div>
			</div>

			<div className='text-text-second absolute -bottom-2 left-1/2 -z-10 -translate-x-1/2 transform text-sm text-nowrap'>
				Free Disk Space: {freeDiskSpace}gb
			</div>

			<Indication usage={usage} />
		</div>
	)
}

export { Disk }
