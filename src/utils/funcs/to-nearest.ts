export const toNearest = (num: number, nearest: number): number => {
	return Math.round(num / nearest) * nearest
}
