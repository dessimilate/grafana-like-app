'use client'

import { ChevronDown, Clock10 } from 'lucide-react'
import { useState } from 'react'

import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

const PeriodTimeButton: NextComponentType = () => {
	const { currentPanel, changePeriodTime } = usePanelStore()

	const [isPeriodOpen, setIsPeriodOpen] = useState(false)

	const periodMinutes = currentPanel.periodTime
	const periodHours = Math.floor(periodMinutes / 60)

	const periodVariants = [
		{ label: 'Last 1m', value: 1 },
		{ label: 'Last 5m', value: 5 },
		{ label: 'Last 30m', value: 30 }
	]

	return (
		<div className='bg-background-second relative border px-2 py-1 text-sm'>
			<button
				className='flex items-center'
				onClick={() => setIsPeriodOpen(state => !state)}
			>
				<Clock10 className='mr-2 w-5' />
				<div className='flex gap-1'>
					<span>Last</span>
					{!!periodHours && <span>{periodHours}h</span>}
					{!!(periodMinutes % 60) && <span>{periodMinutes % 60}m</span>}
				</div>
				<ChevronDown className='ml-1 w-4' />
			</button>

			{isPeriodOpen && (
				<div className='bg-background-second animate-fade-in-200 absolute top-full left-0 z-10 mt-1 flex w-full flex-col border px-2 text-center text-sm'>
					{periodVariants.map(variant => (
						<button
							key={variant.value + 'period'}
							className='py-1'
							onClick={() => {
								changePeriodTime(variant.value)
								setIsPeriodOpen(false)
							}}
						>
							{variant.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export { PeriodTimeButton }
