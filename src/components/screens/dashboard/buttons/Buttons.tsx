'use client'

import { NextComponentType } from '@/types/next-component.type'

import { AppChangeButton } from './AppChangeButton'
import { PeriodTimeButton } from './PeriodTimeButton'
import { RefreshTimeButton } from './RefreshTimeButton'

const Buttons: NextComponentType = () => {
	return (
		<div className='my-4 flex justify-between'>
			<div className='flex gap-2'>
				<AppChangeButton />
			</div>

			<div className='flex gap-2'>
				<PeriodTimeButton />

				<RefreshTimeButton />
			</div>
		</div>
	)
}

export { Buttons }
