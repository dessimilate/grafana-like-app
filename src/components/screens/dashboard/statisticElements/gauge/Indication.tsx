'use client'

import { motion } from 'framer-motion'

import { getUsageColor } from '@/utils/helpers/getUsageColor'

interface IndicationProps {
	usage: number
}

const Indication = ({ usage }: IndicationProps) => {
	return (
		<motion.div
			animate={{ backgroundColor: getUsageColor(usage) }}
			className='animate-blink absolute top-0 right-0 h-4 w-4 rounded-full'
		/>
	)
}

export { Indication }
