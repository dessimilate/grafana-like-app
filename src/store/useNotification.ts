import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface NotificationStates {
	cpuLoadTime: number
	memoryLoadTime: number
}

interface NotificationActions {
	changeCpuLoadTime: (time: number) => void
	changeMemoryLoadTime: (time: number) => void
}

export type NotificationStore = NotificationStates & NotificationActions

const initState: NotificationStates = {
	cpuLoadTime: 0,
	memoryLoadTime: 0
}

export const useNotificationStore = create<NotificationStore>()(
	persist(
		immer((set, get) => ({
			...initState,

			changeCpuLoadTime: (time: number) => {
				set(state => {
					state.cpuLoadTime = time
				})
			},

			changeMemoryLoadTime: (time: number) => {
				set(state => {
					state.memoryLoadTime = time
				})
			}
		})),
		{
			name: 'notification-storage',
			partialize: state => ({
				cpuLoadTime: state.cpuLoadTime,
				memoryLoadTime: state.memoryLoadTime
			})
		}
	)
)
