'use client'

import { ChevronDown } from 'lucide-react'

import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

import { useOutside } from '@/hooks/useOutside'

const EndPointChangeButton: NextComponentType = () => {
	const { currentPanel, panels, changeCurrentEndpoint } = usePanelStore()

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
					{currentPanel.layout.currentEndpoint}
					<ChevronDown className='ml-1 w-4' />
				</button>

				{isShow && (
					<div
						ref={ref}
						className='bg-background-second absolute top-full left-0 z-10 mt-1 flex w-full flex-col gap-2 border py-2'
					>
						{panels
							.find(
								panel =>
									panel.layout.currentEndpoint ===
									currentPanel.layout.currentEndpoint
							)
							?.layout.withEndpoints.map(withEndpoint => (
								<button
									onClick={() => {
										changeCurrentEndpoint(withEndpoint.endpoint)
										setIsShow(false)
									}}
									key={withEndpoint.endpoint + 'endpoint-name'}
								>
									{withEndpoint.endpoint}
								</button>
							))}
					</div>
				)}
			</div>
		</div>
	)
}

export { EndPointChangeButton }
