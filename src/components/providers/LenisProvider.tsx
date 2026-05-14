'use client'

import { ReactLenis } from 'lenis/react'
import { PropsWithChildren } from 'react'

import { LENIS_CONFIG } from '@/config/lenis.config'

const LenisProvider = ({ children }: PropsWithChildren) => {
	return (
		<ReactLenis
			root
			options={LENIS_CONFIG}
		>
			{children}
		</ReactLenis>
	)
}

export { LenisProvider }
