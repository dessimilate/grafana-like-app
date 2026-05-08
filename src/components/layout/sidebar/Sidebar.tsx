'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'

import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

const Sidebar: NextComponentType = () => {
	const { currentPanel } = usePanelStore()

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
					<span>{currentPanel?.name}</span>
				</div>
			</div>

			{/* <div className='bg-background-main flex h-auto items-center border py-0.5'>
				<Search className='mx-1 h-5' />
				<input
					className='h-6 w-50'
					placeholder='Search'
				/>
			</div> */}
		</aside>
	)
}

export { Sidebar }
