import { PropsWithChildren } from 'react'

import { NextComponentType } from '@/types/next-component.type'

import { Sidebar } from './sidebar/Sidebar'

const Layout: NextComponentType<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Sidebar />

			<main className='pt-14'>{children}</main>
		</>
	)
}

export { Layout }
