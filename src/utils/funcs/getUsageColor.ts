export const getUsageColor = (usage: number) => {
	if (usage <= 85) {
		const t = Math.max(0, (usage - 75) / 10)

		const r = Math.round(34 + (234 - 34) * t)
		const g = Math.round(197 + (179 - 197) * t)
		const b = Math.round(94 + (8 - 94) * t)

		return `rgb(${r}, ${g}, ${b})`
	}

	if (usage <= 95) {
		const t = (usage - 85) / 10

		const r = Math.round(234 + (239 - 234) * t)
		const g = Math.round(179 + (68 - 179) * t)
		const b = Math.round(8 + (68 - 8) * t)

		return `rgb(${r}, ${g}, ${b})`
	}

	return 'rgb(239, 68, 68)'
}
