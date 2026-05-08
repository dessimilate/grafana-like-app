'use client'

import { NextComponentType } from '@/types/next-component.type'

import { AppChangeButton } from './AppChangeButton'
import { EndPointChangeButton } from './EndpointChangeButton'
import { PeriodTimeButton } from './PeriodTimeButton'
import { RefreshTimeButton } from './RefreshTimeButton'

const Buttons: NextComponentType = () => {
	return (
		<div className='my-4 flex justify-between'>
			<div className='flex gap-2'>
				<AppChangeButton />

				<EndPointChangeButton />
			</div>

			<div className='flex gap-2'>
				<PeriodTimeButton />

				<RefreshTimeButton />
			</div>
		</div>
	)
}

export { Buttons }
