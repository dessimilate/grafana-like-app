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
	{ i: '6', x: 2, y: 5, w: 2, h: 3, type: 'memory', info: [] }
]

const defaultStates = {
	...defaultTime,
	layout: {
		currentEndpoint: '/api/product/food',
		withEndpoints: [
			{ endpoint: '/api/product/food', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/drinks', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/cutlery', data: defaultEndpointsLayout },
			{ endpoint: '/api/product/snack', data: defaultEndpointsLayout }
		],
		static: defaultStaticLayout
	}
}

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
			getActualPanels: () => {
				return get().panels
			}
		})),
		{
			name: 'panel-storage',
			partialize: state => ({
				panels: state.panels,
				currentPanel: state.currentPanel
			})
		}
	)
)
