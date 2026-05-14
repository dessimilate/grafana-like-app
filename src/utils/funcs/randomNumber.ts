/**
 * @param min minimal value (inclusive)
 * @param max maximal value (inclusive)
 * @returns a random integer between min and max, inclusive
 */
export const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}
