'use client'

import { ChevronDown, RefreshCcw } from 'lucide-react'
import { useState } from 'react'

import { usePanelStore } from '@/store/usePanelsStore'

import { useOutside } from '@/hooks/useOutside'

const RefreshTimeButton = () => {
	const { changeRefreshTime } = usePanelStore()
	const refreshTime = usePanelStore(
		state => state.panels[state.currentPanelName].refreshTime
	)

	const { ref, isShow, setIsShow } = useOutside(false)

	const refreshMinutes = Math.floor(refreshTime / 60)

	const refreshVariants = [
		{ label: 'Refresh 1s', value: 1 },
		{ label: 'Refresh 5s', value: 5 },
		{ label: 'Refresh 15s', value: 15 }
	]

	return (
		<div className='bg-background-second relative border px-2 py-1 text-sm'>
			<button
				className='flex items-center'
				onClick={() => setIsShow(state => !state)}
			>
				<RefreshCcw className='mr-2 w-5' />
				<div className='flex gap-1'>
					<span>Refresh</span>
					{!!refreshMinutes && <span>{refreshMinutes}m</span>}
					{!!(refreshTime % 60) && <span>{refreshTime % 60}s</span>}
				</div>
				<ChevronDown className='ml-1 w-4' />
			</button>

			{isShow && (
				<div
					ref={ref}
					className='bg-background-second animate-fade-in-200 absolute top-full left-0 z-10 mt-1 flex w-full flex-col border px-2 text-center text-sm'
				>
					{refreshVariants.map(variant => (
						<button
							key={variant.value + 'refresh'}
							className='py-1'
							onClick={() => {
								changeRefreshTime(variant.value)
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

export { RefreshTimeButton }
