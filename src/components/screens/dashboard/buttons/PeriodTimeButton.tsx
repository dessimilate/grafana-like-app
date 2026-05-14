'use client'

import { ChevronDown, Clock10 } from 'lucide-react'

import { usePanelStore } from '@/store/usePanelsStore'

import { useOutside } from '@/hooks/useOutside'

const PeriodTimeButton = () => {
	const { changePeriodTime } = usePanelStore()
	const periodTime = usePanelStore(
		state => state.panels[state.currentPanelName].periodTime
	)

	const { ref, isShow, setIsShow } = useOutside(false)

	const periodHours = Math.floor(periodTime / 60)

	const periodVariants = [
		{ label: 'Last 1m', value: 1 },
		{ label: 'Last 5m', value: 5 },
		{ label: 'Last 10m', value: 10 }
	]

	return (
		<div className='bg-background-second relative border px-2 py-1 text-sm'>
			<button
				className='flex items-center'
				onClick={() => setIsShow(state => !state)}
			>
				<Clock10 className='mr-2 w-5' />
				<div className='flex gap-1'>
					<span>Last</span>
					{!!periodHours && <span>{periodHours}h</span>}
					{!!(periodTime % 60) && <span>{periodTime % 60}m</span>}
				</div>
				<ChevronDown className='ml-1 w-4' />
			</button>

			{isShow && (
				<div
					ref={ref}
					className='bg-background-second animate-fade-in-200 absolute top-full left-0 z-10 mt-1 flex w-full flex-col border px-2 text-center text-sm'
				>
					{periodVariants.map(variant => (
						<button
							key={variant.value + 'period'}
							className='py-1'
							onClick={() => {
								changePeriodTime(variant.value)
								setIsShow(false)
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
