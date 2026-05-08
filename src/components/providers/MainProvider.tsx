'use client'

import { PropsWithChildren } from 'react'

import { NextComponentType } from '@/types/next-component.type'

import { Layout } from '../layout/Layout'

import { LenisProvider } from './LenisProvider'

const MainProvider: NextComponentType<PropsWithChildren> = ({ children }) => {
	return (
		<LenisProvider>
			<Layout>{children}</Layout>
		</LenisProvider>
	)
}

export { MainProvider }
