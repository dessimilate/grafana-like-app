'use client'

import { ReactLenis } from 'lenis/react'
import { PropsWithChildren } from 'react'

// TODO: NextComponentType — внутренний тип Next.js (next/dist/...), тянет NextPageContext из Pages Router.
// Для обычного React-компонента в App Router достаточно PropsWithChildren без обёртки.
import { NextComponentType } from '@/types/next-component.type'

const LenisProvider: NextComponentType<PropsWithChildren> = ({ children }) => {
	return (
		<ReactLenis
			root
			options={{
				duration: 0.8, // TODO: вынести в именованную константу SCROLL_DURATION
				easing: (t: number) => 1 - Math.pow(1 - t, 3), // TODO: вынести за компонент - пересоздаётся на каждый рендер
				smoothWheel: true,
				anchors: true
			}}
		>
			{children}
		</ReactLenis>
	)
}

export { LenisProvider }
