import { PropsWithChildren } from 'react'

import { Sidebar } from './sidebar/Sidebar'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Sidebar />

			<main className='pt-14'>{children}</main>
		</>
	)
}

export { Layout }
