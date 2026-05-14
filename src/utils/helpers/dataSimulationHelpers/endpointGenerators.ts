import { ENDPOINT } from '@/constants/dataSimulation.constant'

import { getRandomInt } from '@/utils/funcs/randomNumber'

export const ENDPOINT_GENERATORS: Record<string, () => any> = {
	'count-get': () => {
		const { MIN, MAX } = ENDPOINT.COUNT_GET
		return getRandomInt(MIN, MAX)
	},
	'avg-duration': () => {
		const { MIN, MAX } = ENDPOINT.AVG_DURATION
		return getRandomInt(MIN, MAX)
	},
	'req-per-sec': () => {
		const { MIN, MAX } = ENDPOINT.REQ_PER_SEC
		return getRandomInt(MIN, MAX)
	},
	'req-with-err': () => {
		const { MIN, MAX } = ENDPOINT.REQ_WITH_ERR
		return getRandomInt(MIN, MAX)
	}
}
