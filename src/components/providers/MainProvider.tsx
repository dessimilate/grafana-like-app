'use client'

import { PropsWithChildren } from 'react'

import { useDataSimulation } from '@/hooks/useDataSimulation'

import { Layout } from '../layout/Layout'

import { LenisProvider } from './LenisProvider'

const MainProvider = ({ children }: PropsWithChildren) => {
	useDataSimulation()

	return (
		<LenisProvider>
			<Layout>{children}</Layout>
		</LenisProvider>
	)
}

export { MainProvider }
