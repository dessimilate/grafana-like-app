import { Layout } from 'react-grid-layout'

import { LayoutItemGrid } from '@/types/LayoutItemGrid.type'

export const mergeLayout = (
	current: LayoutItemGrid[],
	newLayout: Layout
): LayoutItemGrid[] => {
	return current.map(item => {
		const updated = newLayout.find(l => l.i === item.i)

		if (!updated) return item

		return {
			...item,

			x: updated.x,
			y: updated.y,
			w: updated.w,
			h: updated.h
		}
	})
}
