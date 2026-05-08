'use client'

import { LayoutItem, Responsive, useContainerWidth } from 'react-grid-layout'
import { noCompactor } from 'react-grid-layout/core'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { NextComponentType } from '@/types/next-component.type'

import { LayoutWrapper, usePanelStore } from '@/store/usePanelsStore'

import { StatisticElement } from './StatisticElement'
import { Buttons } from './buttons/Buttons'

const Dashboard: NextComponentType = () => {
	const { width, containerRef } = useContainerWidth()

	const { currentPanel, changeLayout } = usePanelStore()

	const fullLayout = [
		...currentPanel.layout.static,
		...(currentPanel.layout.withEndpoints.find(
			w => w.endpoint === currentPanel.layout.currentEndpoint
		)?.data || [])
	]

	return (
		<div
			className='px-4'
			ref={containerRef}
		>
			<Buttons />

			<Responsive
				layouts={{
					lg: fullLayout,
					md: fullLayout,
					sm: fullLayout
				}}
				breakpoints={{ lg: 1200, md: 996, sm: 768 }}
				cols={{ lg: 6, md: 6, sm: 6 }}
				rowHeight={100}
				margin={[16, 16]}
				containerPadding={[0, 0]}
				width={width}
				compactor={noCompactor}
				onLayoutChange={layout => {
					const newLayout: LayoutWrapper = {
						...currentPanel.layout,
						static: [],
						withEndpoints: currentPanel.layout.withEndpoints.map(w => ({
							...w,
							data:
								w.endpoint === currentPanel.layout.currentEndpoint ? [] : w.data
						}))
					}

					layout.forEach((item: LayoutItem) => {
						const isStatic = currentPanel.layout.static.some(
							s => s.i === item.i
						)

						const originalItem = fullLayout.find(l => l.i === item.i)

						const changedItem = {
							i: item.i,
							x: item.x,
							y: item.y,
							w: item.w,
							h: item.h,
							type: originalItem?.type || 'count-get',
							info: originalItem?.info || []
						}

						if (isStatic) {
							newLayout.static.push(changedItem)
						} else {
							const epIndex = newLayout.withEndpoints.findIndex(
								w => w.endpoint === currentPanel.layout.currentEndpoint
							)
							if (epIndex !== -1) {
								newLayout.withEndpoints[epIndex].data.push(changedItem)
							}
						}
					})

					changeLayout(newLayout)
				}}
			>
				{fullLayout.map(item => (
					<div
						key={item.i}
						className='bg-background-second border'
					>
						<StatisticElement item={item} />
					</div>
				))}
			</Responsive>
		</div>
	)
}

export { Dashboard }
