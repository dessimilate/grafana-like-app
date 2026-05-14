import { LenisOptions } from 'lenis'

const easing = (t: number) => 1 - Math.pow(1 - t, 3)

export const LENIS_CONFIG: LenisOptions = {
	duration: 0.8,
	easing,
	smoothWheel: true,
	anchors: true
}
