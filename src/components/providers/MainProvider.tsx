'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

// TODO: Та же ошибка, что и в LenisProvider.
import { NextComponentType } from '@/types/next-component.type';

import { maxDisk, maxMemory } from '@/config/panels.constant';

import { usePanelStore } from '@/store/usePanelsStore';

import { minMax } from '@/utils/funcs/min-max';
import { getRandomInt } from '@/utils/funcs/random-number';

import { Layout } from '../layout/Layout';

import { LenisProvider } from './LenisProvider';


// TODO: Провайдер объединяет обёртку приложения и строки бизнес-логики мокирования данных.
// Симуляцию стоит вынести в отдельный хук (useDataSimulation / useMockData).
const MainProvider: NextComponentType<PropsWithChildren> = ({ children }) => {
	const {
		currentPanel: { periodTime, refreshTime },
		changeEndpointsInfo,
		changeStaticInfo,
		getActualPanels
	} = usePanelStore()

	// TODO: 1) NodeJS.Timeout — тип Node.js, в браузере setInterval возвращает number.
	//   Использовать ReturnType<typeof setInterval> или number.
	//   2) useState для ID таймера вызывает лишний ре-рендер — лучше useRef.
	const [interv, setInterv] = useState<NodeJS.Timeout>()

	useEffect(() => {
		clearInterval(interv)

		const count = Math.floor((periodTime * 60) / refreshTime) * 2

		const newTimer = setInterval(() => {
			const actualPanels = getActualPanels()

			for (const { layout, name } of actualPanels) {
				// TODO: if/if/if вместо else if / switch — типы взаимоисключающие,
				// каждый if проверяется даже после совпадения.
				for (const { i, type, info } of layout.static) {
					if (type === 'cpu') {
						// TODO: магические числа — вынести в именованные константы или конфиг:
						// delta=7, defaultFallback=50, memoryDeltaPct=0.07, diskDeltaPct=0.005 и т.д.
						const percent = getRandomInt(-7, 7)

						const lastElement = info.at(-1) || 50

						// TODO: повторяется 7 раз.
						// Вынести в хелпер: pushWithLimit(info, value, count) => updatedInfo
						const updatedInfo = [...info]

						if (updatedInfo.length > count) updatedInfo.shift()
						updatedInfo.push(minMax(percent + lastElement, 0, 100))

						changeStaticInfo(name, i, updatedInfo)
					}

					// Из-за большого количества if теряется читаемость.
					// TODO: Можно упростить используя мапы:
					/**
					 * @example
					 * ```
					 * const STATIC_GENERATORS: Record<string, (last: any) => any> = {
					 *   cpu: (last) => ...,
					 *   memory: (last) => ...,
					 *   disk: (last) => ...,
					 *   percent: (last) => ...,
					 *   memory: (last) => ...,
					 * }
					 *
					 * const generator = STATIC_GENERATORS[type]
					 * ```
					 * */
					if (type === 'memory') {
						const mem = getRandomInt(-0.07 * maxMemory, 0.07 * maxMemory)

						const lastElement = info.at(-1) || maxMemory / 2

						const updatedInfo = [...info]

						if (updatedInfo.length > count) updatedInfo.shift()
						updatedInfo.push(minMax(mem + lastElement, 0, maxMemory))

						changeStaticInfo(name, i, updatedInfo)
					}

					if (type === 'disk') {
						const disk = getRandomInt(-7, 7)
						const diskMemoryChange = getRandomInt(
							-0.005 * maxDisk,
							0.005 * maxDisk
						)

						const lastElement = info.at(-1) || {
							percent: 50,
							memory: maxDisk / 4
						}

						const updatedInfo = [...info]

						if (updatedInfo.length > count) updatedInfo.shift()
						updatedInfo.push({
							percent: minMax(disk + lastElement.percent, 0, 100),
							memory: minMax(
								diskMemoryChange + lastElement.memory,
								0,
								maxDisk / 2
							)
						})

						changeStaticInfo(name, i, updatedInfo)
					}
				}

				for (const { endpoint, data } of layout.withEndpoints) {
					for (const { i, type, info } of data) {
						// TODO: так же можно упростить через мапы.
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
		}, refreshTime * 1000) // TODO: refreshTime * 1000 — приведение к мс, вынести в константу MS_PER_SEC

		setInterv(newTimer)
	}, [periodTime, refreshTime])

	return (
		<LenisProvider>
			<Layout>{children}</Layout>
		</LenisProvider>
	)
}

export { MainProvider }
