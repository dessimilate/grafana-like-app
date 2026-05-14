import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { InfoType, LayoutItemGrid } from '@/types/LayoutItemGrid.type'

//Panel Types
interface LayoutEndpoint {
	[endpoint: string]: LayoutItemGrid[]
}

export interface LayoutWrapper {
	currentEndpoint: string
	endpoints: LayoutEndpoint
	static: LayoutItemGrid[]
}

interface Panel {
	periodTime: number //in minutes
	refreshTime: number //in secondes
	layout: LayoutWrapper
	metrics: PanelMetrics
}

interface Panels {
	[panelName: string]: Panel
}

interface PanelMetrics {
	endpoints: {
		[endpoint: string]: {
			[itemId: string]: InfoType[]
		}
	}

	static: {
		[itemId: string]: InfoType[]
	}
}

interface PanelStates {
	panels: Panels
	currentPanelName: string
}

//Store Types
interface PanelActions {
	changeCurrentPanelName: (name: string) => void
	changePeriodTime: (time: number) => void
	changeRefreshTime: (time: number) => void
	changeLayout: (layout: LayoutWrapper) => void
	changeEndpointsInfo: (
		panelName: string,
		layoutIndex: string,
		endpoint: string,
		info: InfoType[]
	) => void
	changeStaticInfo: (panelName: string, i: string, info: InfoType[]) => void
	changeCurrentEndpoint: (endpoint: string) => void
	getActualPanels: () => Panels
}

export type PanelStore = PanelStates & PanelActions

//Set Default Data
const defaultTime: Pick<Panel, 'periodTime' | 'refreshTime'> = {
	periodTime: 5,
	refreshTime: 1
}

const defaultEndpointsLayout: LayoutItemGrid[] = [
	{ i: '1', x: 0, y: 0, w: 2, h: 2, type: 'count-get' },
	{ i: '2', x: 2, y: 0, w: 4, h: 2, maxH: 2, type: 'avg-duration' },
	{ i: '3', x: 0, y: 2, w: 3, h: 3, minH: 3, type: 'req-per-sec' },
	{ i: '4', x: 3, y: 2, w: 3, h: 3, minH: 3, type: 'req-with-err' }
]

const defaultStaticLayout: LayoutItemGrid[] = [
	{ i: '5', x: 0, y: 5, w: 2, h: 3, type: 'cpu' },
	{ i: '6', x: 2, y: 5, w: 2, h: 3, type: 'memory' },
	{ i: '7', x: 4, y: 5, w: 2, h: 3, type: 'disk' }
]

const endpointsArray = [
	'/api/product/food',
	'/api/product/drinks',
	'/api/product/cutlery',
	'/api/product/snack'
]

const createDefaultState = (): Panel => ({
	...defaultTime,

	layout: {
		currentEndpoint: endpointsArray[0],

		endpoints: endpointsArray.reduce<LayoutEndpoint>((acc, endpoint) => {
			acc[endpoint] = structuredClone(defaultEndpointsLayout)
			return acc
		}, {} as LayoutEndpoint),

		static: structuredClone(defaultStaticLayout)
	},

	metrics: {
		endpoints: endpointsArray.reduce<PanelMetrics['endpoints']>(
			(acc, endpoint) => {
				acc[endpoint] = defaultEndpointsLayout.reduce(
					(endpointAcc, item) => {
						endpointAcc[item.i] = []
						return endpointAcc
					},
					{} as { [itemId: string]: InfoType[] }
				)
				return acc
			},
			{} as PanelMetrics['endpoints']
		),

		static: defaultStaticLayout.reduce(
			(acc, item) => {
				acc[item.i] = []
				return acc
			},
			{} as PanelMetrics['static']
		)
	}
})

const panelsNameArray = ['Frontend', 'Backend', 'Postgresql']

const defaultPanels = panelsNameArray.reduce<Panels>((acc, name) => {
	acc[name] = createDefaultState()
	return acc
}, {} as Panels)

const initState: PanelStates = {
	panels: defaultPanels,
	currentPanelName: panelsNameArray[0]
}

//Store
export const usePanelStore = create<PanelStore>()(
	persist(
		immer((set, get) => ({
			...initState,

			//Change Current Panel
			changeCurrentPanelName: name => {
				const panel = !!get().panels[name]
				if (!panel) return

				set(state => {
					state.currentPanelName = name
				})
			},

			//Change Period Time
			changePeriodTime: time => {
				set(state => {
					state.panels[state.currentPanelName].periodTime = time
				})
			},

			//Change Refresh Time
			changeRefreshTime: time => {
				set(state => {
					state.panels[state.currentPanelName].refreshTime = time
				})
			},

			//Change Layout
			changeLayout: layout => {
				set(state => {
					state.panels[state.currentPanelName].layout = layout
				})
			},

			//Change Endpoints Info
			changeEndpointsInfo: (panelName, i, endpoint, info) => {
				const panel = get().panels[panelName]
				if (!panel) return

				set(state => {
					const item = state.panels[panelName].metrics.endpoints[endpoint]
					if (!item) return

					item[i] = info
				})
			},

			//Change Static Info
			changeStaticInfo: (panelName, i, info) => {
				const panel = get().panels[panelName]
				if (!panel) return

				set(state => {
					const item = state.panels[panelName].metrics.static
					if (!item) return

					item[i] = info
				})
			},

			//Change Current Endpoint
			changeCurrentEndpoint: (endpoint: string) => {
				set(state => {
					state.panels[state.currentPanelName].layout.currentEndpoint = endpoint
				})
			},

			//Get Actual Panels
			getActualPanels: () => {
				return get().panels
			}
		})),
		{
			name: 'panel-storage',
			partialize: state => ({
				panels: state.panels,
				currentPanelName: state.currentPanelName
			})
		}
	)
)
