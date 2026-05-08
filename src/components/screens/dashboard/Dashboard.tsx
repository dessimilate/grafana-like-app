'use client'

import { LayoutItem, Responsive, useContainerWidth } from 'react-grid-layout'
import { noCompactor } from 'react-grid-layout/core'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { LayoutItemGrid } from '@/types/grid-layout.type'
import { NextComponentType } from '@/types/next-component.type'

import { usePanelStore } from '@/store/usePanelsStore'

import { StatisticElement } from './StatisticElement'
import { Buttons } from './buttons/Buttons'

const Dashboard: NextComponentType = () => {
	const { width, containerRef } = useContainerWidth()

	const { currentPanel, changeLayout } = usePanelStore()


	return (
		<div
			className='px-4'
			ref={containerRef}
		>
			<Buttons />

			<Responsive
				layouts={{
					lg: currentPanel.layout,
					md: currentPanel.layout,
					sm: currentPanel.layout
				}}
				breakpoints={{ lg: 1200, md: 996, sm: 768 }}
				cols={{ lg: 6, md: 6, sm: 6 }}
				rowHeight={100}
				margin={[16, 16]}
				containerPadding={[0, 0]}
				width={width}
				compactor={noCompactor}
				onLayoutChange={layout => {
					const newLayout = layout.reduce(
						(res: LayoutItemGrid[], item: LayoutItem) => {
							const currentItem: LayoutItemGrid = {
								i: item.i,
								x: item.x,
								y: item.y,
								w: item.w,
								h: item.h,
								type:
									currentPanel.layout.find(l => l.i === item.i)?.type ||
									'count-get',
								info: currentPanel.layout.find(l => l.i === item.i)?.info || []
							}

							res.push(currentItem)
							return res
						},
						[]
					)

					changeLayout(newLayout)
				}}
			>
				{currentPanel.layout.map(item => (
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
