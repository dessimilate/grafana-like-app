import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { LayoutItemGrid } from '@/types/grid-layout.type'

export interface LayoutWrapper {
	currentEndpoint: string
	withEndpoints: {
		endpoint: string
		data: LayoutItemGrid[]
	}[]
	static: LayoutItemGrid[]
}

interface Panel {
	name: string
	periodTime: number //in minutes
	refreshTime: number //in secondes
	layout: LayoutWrapper
}

interface PanelStates {
	panels: Panel[]
	currentPanel: Panel
}

// TODO: info: any[] — потеря типобезопасности. Для cpu/memory это number[],
// для disk это { percent: number; memory: number }[]. Стоит использовать union-тип.
interface PanelActions {
	changeCurrentPanel: (name: string) => void
	addPanel: (name: string) => boolean
	deletePanel: (name: string) => boolean
	changePeriodTime: (time: number) => void
	changeRefreshTime: (time: number) => void
	changeLayout: (layout: LayoutWrapper) => void
	changeEndpointsInfo: (
		name: string,
		i: string,
		endpoint: string,
		info: any[]
	) => void
	changeStaticInfo: (name: string, i: string, info: any[]) => void
	changeCurrentEndpoint: (endpoint: string) => void
	getActualPanels: () => Panel[]
}

export type PanelStore = PanelStates & PanelActions

const defaultTime: Pick<Panel, 'periodTime' | 'refreshTime'> = {
	periodTime: 5,
	refreshTime: 1
}

const defaultEndpointsLayout: LayoutItemGrid[] = [
	{ i: '1', x: 0, y: 0, w: 2, h: 2, type: 'count-get', info: [] },
	{ i: '2', x: 2, y: 0, w: 4, h: 2, maxH: 2, type: 'avg-duration', info: [] },
	{ i: '3', x: 0, y: 2, w: 3, h: 3, minH: 3, type: 'req-per-sec', info: [] },
	{ i: '4', x: 3, y: 2, w: 3, h: 3, minH: 3, type: 'req-with-err', info: [] }
]

const defaultStaticLayout: LayoutItemGrid[] = [
	{ i: '5', x: 0, y: 5, w: 2, h: 3, type: 'cpu', info: [] },
	{ i: '6', x: 2, y: 5, w: 2, h: 3, type: 'memory', info: [] },
	{ i: '7', x: 4, y: 5, w: 2, h: 3, type: 'disk', info: [] }
]

const defaultStates = {
	...defaultTime,
	layout: {
		currentEndpoint: '/api/product/food',
		// TODO: все эндпоинты ссылаются на один объект defaultEndpointsLayout.
		// При мутации через immer изменения затронут все панели.
		// Нужно клонировать: data: defaultEndpointsLayout.map(item => ({ ...item, info: [...item.info] }))
		withEndpoints: [
			{ endpoint: '/api/product/food', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/drinks', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/cutlery', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/snack', data: defaultEndpointsLayout }
		],
		static: defaultStaticLayout
	}
}

// TODO: три одинаковых объекта, отличающихся только name.
// Генерировать из массива: ['Frontend', 'Backend', 'Postgresql'].map(name => ({ name, ...defaultStates }))
const defaultPanel1: Panel = {
	name: 'Frontend',
	...defaultStates
}

const defaultPanel2: Panel = {
	name: 'Backend',
	...defaultStates
}

const defaultPanel3: Panel = {
	name: 'Postgresql',
	...defaultStates
}

const initState: PanelStates = {
	panels: [defaultPanel1, defaultPanel2, defaultPanel3],
	currentPanel: defaultPanel1
}

export const usePanelStore = create<PanelStore>()(
	persist(
		immer((set, get) => ({
			...initState,

			// TODO: АРХИТЕКТУРНАЯ ПРОБЛЕМА — currentPanel дублирует данные из panels[].
			// Каждый action обновляет и currentPanel, и panels[] — это львиная доля кода и риск рассинхронизации.
			// Например, можно хранить только currentPanelName (string), а currentPanel вычислять через panels.find().

			//CHANGE CURRENT PANEL
			changeCurrentPanel: name => {
				const panel = get().panels.find(panel => panel.name === name)
				if (panel) {
					set(state => {
						state.currentPanel = panel
					})
				}
			},

			//ADD
			// TODO: set вызывается всегда, даже когда нет изменений (isExists=true).
			// Проверку стоит делать до set, и вызывать set только при реальном изменении.
			addPanel: name => {
				const isExists = !!get().panels.find(panel => panel.name === name)

				set(state => {
					const newPanel = { name, ...defaultStates }
					if (!isExists) state.panels.push(newPanel)
				})

				//if not exists -> add panel(return true), else return false
				return !isExists
			},

			//DELETE
			// TODO: та же проблема — set вызывается всегда. Проверку делать до set.
			deletePanel: name => {
				const index = get().panels.findIndex(panel => panel.name === name)
				const isExists = index !== -1

				set(state => {
					if (isExists) state.panels.splice(index, 1)
				})

				//if exists -> delete panel(return true), else return false
				return isExists
			},

			//CHANGE PERIOD TIME
			// Если хранить только currentPanelName, этот код сократится до одного присвоения.
			changePeriodTime: time => {
				set(state => {
					state.currentPanel.periodTime = time

					const index = get().panels.findIndex(
						panel => panel.name === get().currentPanel.name
					)
					if (index !== -1) state.panels[index].periodTime = time
				})
			},

			//CHANGE REFRESH TIME
			changeRefreshTime: time => {
				set(state => {
					state.currentPanel.refreshTime = time

					const index = get().panels.findIndex(
						panel => panel.name === get().currentPanel.name
					)
					if (index !== -1) state.panels[index].refreshTime = time
				})
			},

			//CHANGE LAYOUT
			changeLayout: layout => {
				set(state => {
					state.currentPanel.layout = layout

					const index = get().panels.findIndex(
						panel => panel.name === get().currentPanel.name
					)
					if (index !== -1) state.panels[index].layout = layout
				})
			},

			//CHANGE INFO
			// TODO: 40 строк дублированной логики.
			// Также три уровня findIndex - хрупко, стоит вынести в хелпер или утилиту.
			changeEndpointsInfo: (name, i, endpoint, info) => {
				set(state => {
					if (name === state.currentPanel.name) {
						const endpointIndex =
							state.currentPanel.layout.withEndpoints.findIndex(
								item => item.endpoint === endpoint
							)

						if (endpointIndex !== -1) {
							const layoutIndex = state.currentPanel.layout.withEndpoints[
								endpointIndex
							].data.findIndex(item => item.i === i)
							if (layoutIndex !== -1) {
								state.currentPanel.layout.withEndpoints[endpointIndex].data[
									layoutIndex
								].info = info
							}
						}
					}

					const panelIndex = get().panels.findIndex(
						panel => panel.name === name
					)
					if (panelIndex !== -1) {
						const endpointIndex = state.panels[
							panelIndex
						].layout.withEndpoints.findIndex(item => item.endpoint === endpoint)
						if (endpointIndex !== -1) {
							const layoutIndex = state.panels[panelIndex].layout.withEndpoints[
								endpointIndex
							].data.findIndex(item => item.i === i)
							if (layoutIndex !== -1) {
								state.panels[panelIndex].layout.withEndpoints[
									endpointIndex
								].data[layoutIndex].info = info
							}
						}
					}
				})
			},

			//CHANGE STATIC INFO
			changeStaticInfo: (name, i, info) => {
				set(state => {
					if (name === state.currentPanel.name) {
						const layoutIndex = state.currentPanel.layout.static.findIndex(
							item => item.i === i
						)
						if (layoutIndex !== -1) {
							state.currentPanel.layout.static[layoutIndex].info = info
						}
					}

					const panelIndex = get().panels.findIndex(
						panel => panel.name === name
					)
					if (panelIndex !== -1) {
						const layoutIndex = state.panels[
							panelIndex
						].layout.static.findIndex(item => item.i === i)
						if (layoutIndex !== -1) {
							state.panels[panelIndex].layout.static[layoutIndex].info = info
						}
					}
				})
			},

			//CHANGE CURRENT ENDPOINT
			// TODO: два вызова set — два ре-рендера вместо одного.
			// С immer можно объединить в один set.
			changeCurrentEndpoint: (endpoint: string) => {
				const panelIndex = get().panels.findIndex(
					panel => panel.name === get().currentPanel.name
				)
				if (panelIndex !== -1) {
					set(state => {
						state.panels[panelIndex].layout.currentEndpoint = endpoint
					})
				}

				set(state => {
					state.currentPanel.layout.currentEndpoint = endpoint
				})
			},

			//GET ACTUAL PANEL
			// TODO: простая обёртка над get().panels без добавочной логики.
			// Используется для вызова внутри setInterval (MainProvider) — если так и задумано, ок.
			getActualPanels: () => {
				return get().panels
			}
		})),
		{
			name: 'panel-storage',
			// TODO: при изменении структуры PanelStates старые данные в localStorage
			partialize: state => ({
				panels: state.panels,
				currentPanel: state.currentPanel
			})
		}
	)
)
