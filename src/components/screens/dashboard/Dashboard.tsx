'use client'

import { useMemo } from 'react'
import { Layout, Responsive, useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { usePanelStore } from '@/store/usePanelsStore'

import { mergeLayout } from '@/utils/helpers/dashboardHelpers/layoutMerge'

import { Buttons } from './buttons/Buttons'
import { StatisticElement } from './statisticElements/StatisticElement'

const Dashboard = () => {
	const { width, containerRef } = useContainerWidth()

	const changeLayout = usePanelStore(state => state.changeLayout)

	const panelLayout = usePanelStore(
		state => state.panels[state.currentPanelName]?.layout
	)

	const fullLayout = useMemo(() => {
		if (!panelLayout) return []
		return [
			...panelLayout.static,
			...panelLayout.endpoints[panelLayout.currentEndpoint]
		]
	}, [panelLayout])

	const responsiveLayouts = useMemo(
		() => ({
			lg: fullLayout,
			md: fullLayout,
			sm: fullLayout
		}),
		[fullLayout]
	)

	const handleLayoutChange = (layout: Layout) => {
		console.log('change layout')
		if (!panelLayout) return

		const updatedStatic = mergeLayout(panelLayout.static, layout)

		const updatedEndpoint = mergeLayout(
			panelLayout.endpoints[panelLayout.currentEndpoint] || [],
			layout
		)

		changeLayout({
			...panelLayout,

			static: updatedStatic,

			endpoints: {
				...panelLayout.endpoints,

				[panelLayout.currentEndpoint]: updatedEndpoint
			}
		})
	}

	return (
		<div
			className='px-4'
			ref={containerRef}
		>
			<Buttons />

			<Responsive
				layouts={responsiveLayouts}
				breakpoints={{ lg: 1200, md: 996, sm: 768 }}
				cols={{ lg: 6, md: 6, sm: 6 }}
				rowHeight={100}
				margin={[16, 16]}
				containerPadding={[0, 0]}
				width={width}
				onLayoutChange={handleLayoutChange}
			>
				{fullLayout.map(item => (
					<div
						key={item.i}
						className='bg-background-second border select-none'
					>
						<StatisticElement
							i={item.i}
							type={item.type}
						/>
					</div>
				))}
			</Responsive>
		</div>
	)
}

export { Dashboard }
