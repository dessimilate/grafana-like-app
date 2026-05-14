'use client'

import Image from 'next/image'

import { usePanelStore } from '@/store/usePanelsStore'

const Sidebar = () => {
	const currentPanelName = usePanelStore(state => state.currentPanelName)

	return (
		<aside className='bg-background-second fixed top-0 z-1000 flex h-14 w-screen items-center justify-between border-b px-6 py-1'>
			<div className='flex items-center'>
				<Image
					src='/logo.webp'
					alt='Logo'
					className='mr-4 h-8 w-auto'
					width={100}
					height={100}
				/>
				<div className='flex gap-2'>
					<span>Dashboard</span>
					<span className='text-text-second'>{'>'}</span>
					<span>{currentPanelName}</span>
				</div>
			</div>
		</aside>
	)
}

export { Sidebar }
