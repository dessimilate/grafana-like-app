import { InfoType } from '@/types/LayoutItemGrid.type'

export const MAX_MEMORY = 64 * 1024
export const MAX_DISK = 2 * 1024 * 1024

export const STATIC: Record<string, number> = {
	CPU_DELTA: 7,
	MEMORY_DELTA: 0.07,
	DISK_SPACE_DELTA: 0.005,
	DISK_USAGE_DELTA: 7
}

export const ENDPOINT: Record<string, { MIN: number; MAX: number }> = {
	COUNT_GET: { MIN: 1, MAX: 20 },
	AVG_DURATION: { MIN: 10, MAX: 300 },
	REQ_PER_SEC: { MIN: 40, MAX: 70 },
	REQ_WITH_ERR: { MIN: 2, MAX: 6 }
}

export const DEFAULT_VALUES: Record<string, InfoType> = {
	cpu: 50,
	memory: MAX_MEMORY / 2,
	disk: { percent: 50, memory: MAX_DISK / 2 }
}
