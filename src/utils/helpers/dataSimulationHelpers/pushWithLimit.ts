export const pushWithLimit = (array: any[], value: any, limit: number) => {
	const updatedArray = [...array, value]
	if (updatedArray.length > limit) {
		updatedArray.shift()
	}
	return updatedArray
}
