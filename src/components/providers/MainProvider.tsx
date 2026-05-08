'use client'

import { PropsWithChildren, useEffect, useState } from 'react'

import { NextComponentType } from '@/types/next-component.type'

import { maxMemory } from '@/config/panels.constant'

import { usePanelStore } from '@/store/usePanelsStore'

import { minMax } from '@/utils/funcs/min-max'
import { getRandomInt } from '@/utils/funcs/random-number'

import { Layout } from '../layout/Layout'

import { LenisProvider } from './LenisProvider'

const MainProvider: NextComponentType<PropsWithChildren> = ({ children }) => {
	const {
		currentPanel: { periodTime, refreshTime },
		changeEndpointsInfo,
		changeStaticInfo,
		getActualPanels
	} = usePanelStore()

	const [interv, setInterv] = useState<NodeJS.Timeout>()

	useEffect(() => {
		clearInterval(interv)

		const count = Math.floor((periodTime * 60) / refreshTime) * 2

		const newTimer = setInterval(() => {
			const actualPanels = getActualPanels()

			for (const { layout, name } of actualPanels) {
				for (const { i, type, info } of layout.static) {
					if (type === 'cpu') {
						const percent = getRandomInt(-7, 7)

						const lastElement = info.at(-1) || 50

						const updatedInfo = [...info]

						if (updatedInfo.length > count) updatedInfo.shift()
						updatedInfo.push(minMax(percent + lastElement, 0, 100))

						changeStaticInfo(name, i, updatedInfo)
					}

					if (type === 'memory') {
						const mem = getRandomInt(-0.07 * maxMemory, 0.07 * maxMemory)

						const lastElement = info.at(-1) || maxMemory / 2

						const updatedInfo = [...info]

						if (updatedInfo.length > count) updatedInfo.shift()
						updatedInfo.push(minMax(mem + lastElement, 0, maxMemory))

						changeStaticInfo(name, i, updatedInfo)
					}
				}

				for (const { endpoint, data } of layout.withEndpoints) {
					for (const { i, type, info } of data) {
						if (type === 'count-get') {
							const reqCount = getRandomInt(1, 20)

							const updatedInfo = [...info]

							if (updatedInfo.length > count) updatedInfo.shift()
							updatedInfo.push(reqCount)

							changeEndpointsInfo(name, i, endpoint, updatedInfo)
						}

						if (type === 'avg-duration') {
							const avgDuration = getRandomInt(10, 300)

							const updatedInfo = [...info]

							if (updatedInfo.length > count) updatedInfo.shift()
							updatedInfo.push(avgDuration)

							changeEndpointsInfo(name, i, endpoint, updatedInfo)
						}

						if (type === 'req-per-sec') {
							const reqPerSec = getRandomInt(40, 70)

							const updatedInfo = [...info]

							if (updatedInfo.length > count) updatedInfo.shift()
							updatedInfo.push(reqPerSec)

							changeEndpointsInfo(name, i, endpoint, updatedInfo)
						}

						if (type === 'req-with-err') {
							const reqWithErr = getRandomInt(2, 6)

							const updatedInfo = [...info]

							if (updatedInfo.length > count) updatedInfo.shift()
							updatedInfo.push(reqWithErr)

							changeEndpointsInfo(name, i, endpoint, updatedInfo)
						}
					}
				}
			}
		}, refreshTime * 1000)

		setInterv(newTimer)
	}, [periodTime, refreshTime])

	return (
		<LenisProvider>
			<Layout>{children}</Layout>
		</LenisProvider>
	)
}

export { MainProvider }
