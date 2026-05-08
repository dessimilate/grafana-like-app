'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

const AppChangeButton: NextComponentType = () => {
	const { currentPanel, panels, changeCurrentPanel } = usePanelStore()

	const [isAppChangeOpen, setIsAppChangeOpen] = useState(false)

	return (
		<div className='relative flex'>
			<div className='bg-background-second flex items-center border px-2 py-1 text-sm'>
				Application Name
			</div>
			<div className='border border-l-0 px-2 py-1 text-sm select-none'>
				<button
					className='flex items-center'
					onClick={() => setIsAppChangeOpen(state => !state)}
				>
					{currentPanel.name}
					<ChevronDown className='ml-1 w-4' />
				</button>

				{isAppChangeOpen && (
					<div className='bg-background-second absolute top-full left-0 z-10 mt-1 flex w-full flex-col gap-2 border py-2'>
						{panels.map(panel => (
							<button
								onClick={() => changeCurrentPanel(panel.name)}
								key={panel.name + 'app-name'}
							>
								{panel.name}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export { AppChangeButton }
