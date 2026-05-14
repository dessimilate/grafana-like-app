'use client'

import { ChevronDown } from 'lucide-react'

import { usePanelStore } from '@/store/usePanelsStore'

import { useOutside } from '@/hooks/useOutside'

const EndPointChangeButton = () => {
	const { changeCurrentEndpoint } = usePanelStore()

	const currentEndpoint = usePanelStore(
		state => state.panels[state.currentPanelName]?.layout.currentEndpoint
	)

	const withEndpoints = usePanelStore(
		state => state.panels[state.currentPanelName].layout.endpoints
	)
	const endpoints = Object.keys(withEndpoints)

	const { ref, isShow, setIsShow } = useOutside(false)

	return (
		<div className='relative flex'>
			<div className='bg-background-second flex items-center border px-2 py-1 text-sm'>
				Endpoint
			</div>
			<div className='border border-l-0 px-2 py-1 text-sm select-none'>
				<button
					className='flex items-center'
					onClick={() => setIsShow(state => !state)}
				>
					{currentEndpoint}
					<ChevronDown className='ml-1 w-4' />
				</button>

				{isShow && (
					<div
						ref={ref}
						className='bg-background-second absolute top-full left-0 z-10 mt-1 flex w-full flex-col gap-2 border py-2'
					>
						{endpoints.map(endpoint => (
							<button
								onClick={() => {
									changeCurrentEndpoint(endpoint)
									setIsShow(false)
								}}
								key={endpoint + 'endpoint-name'}
							>
								{endpoint}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export { EndPointChangeButton }
