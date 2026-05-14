import { useEffect, useRef } from 'react'

import { DEFAULT_VALUES } from '@/constants/dataSimulation.constant'

import { usePanelStore } from '@/store/usePanelsStore'

import { ENDPOINT_GENERATORS } from '@/utils/helpers/dataSimulationHelpers/endpointGenerators'
import { pushWithLimit } from '@/utils/helpers/dataSimulationHelpers/pushWithLimit'
import { STATIC_GENERATORS } from '@/utils/helpers/dataSimulationHelpers/staticGenerators'

const MS_PER_SEC = 1000

export const useDataSimulation = () => {
	const { changeEndpointsInfo, changeStaticInfo, getActualPanels } =
		usePanelStore()

	const currentPanel = usePanelStore(
		state => state.panels[state.currentPanelName]
	)

	const periodTime = currentPanel?.periodTime
	const refreshTime = currentPanel?.refreshTime

	const intervalRef = useRef<number>(0)

	useEffect(() => {
		clearInterval(intervalRef.current)

		const count = Math.floor((periodTime * 60) / refreshTime) * 2

		const newTimer = setInterval(() => {
			const actualPanels = getActualPanels()

			for (const [name, { layout, metrics }] of Object.entries(actualPanels)) {
				for (const { i, type } of layout.static) {
					const info = metrics.static[i] || []
					const defaultValue = DEFAULT_VALUES[type]
					const lastValue = info.at(-1) || defaultValue

					const value = STATIC_GENERATORS[type](lastValue)
					const updatedInfo = pushWithLimit(info, value, count)
					changeStaticInfo(name, i, updatedInfo)
				}

				for (const [endpoint, items] of Object.entries(layout.endpoints)) {
					for (const { i, type } of items) {
						const info = metrics.endpoints[endpoint][i] || []
						const value = ENDPOINT_GENERATORS[type]()

						const updatedInfo = pushWithLimit(info, value, count)
						changeEndpointsInfo(name, i, endpoint, updatedInfo)
					}
				}
			}
		}, refreshTime * MS_PER_SEC)

		intervalRef.current = newTimer as any
	}, [periodTime, refreshTime])
}
