import {
	MAX_DISK,
	MAX_MEMORY,
	STATIC
} from '@/constants/dataSimulation.constant'

import { getRandomInt } from '@/utils/funcs/randomNumber'

import { minMax } from '../minMax'

export const STATIC_GENERATORS: Record<string, (last: any) => any> = {
	cpu: last => {
		const delta = STATIC.CPU_DELTA
		return minMax(last + getRandomInt(-delta, delta), 0, 100)
	},
	memory: last => {
		const delta = STATIC.MEMORY_DELTA * MAX_MEMORY
		return minMax(last + getRandomInt(-delta, delta), 0, MAX_MEMORY)
	},
	disk: last => {
		const diskMemoryDelta = STATIC.DISK_SPACE_DELTA * MAX_DISK
		const diskMemoryChange = getRandomInt(-diskMemoryDelta, diskMemoryDelta)

		const diskUsageDelta = STATIC.DISK_USAGE_DELTA
		const distUsage = getRandomInt(-diskUsageDelta, diskUsageDelta)

		return {
			percent: minMax(distUsage + last.percent, 0, 100),
			memory: minMax(diskMemoryChange + last.memory, 0, MAX_DISK / 2)
		}
	}
}
