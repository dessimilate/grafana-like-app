'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useLenis } from './useLenis'

export function useAnchorScroll() {
	const lenis = useLenis()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (!lenis) return

		const hash = window.location.hash

		if (!hash) return

		const id = hash.replace('#', '')

		const el = document.getElementById(id)

		if (!el) return

		setTimeout(() => {
			lenis.scrollTo(el, {
				offset: -80,
				duration: 1.5
			})
		}, 50)
	}, [pathname, searchParams, lenis])
}
