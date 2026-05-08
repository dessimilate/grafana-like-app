'use client'

import { ReactLenis } from 'lenis/react'
import { PropsWithChildren } from 'react'

import { NextComponentType } from '@/types/next-component.type'

const LenisProvider: NextComponentType<PropsWithChildren> = ({ children }) => {
	return (
		<ReactLenis
			root
			options={{
				duration: 0.8,
				easing: (t: number) => 1 - Math.pow(1 - t, 3),
				smoothWheel: true,
				anchors: true
			}}
		>
			{children}
		</ReactLenis>
	)
}

export { LenisProvider }
