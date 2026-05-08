'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NextComponentType } from '@/types/next-component.type'

import { cn } from '@/utils/cn'

interface IProps {
	href: string
	title: string
	Icon: LucideIcon
}

const SidebarNavElement: NextComponentType<IProps> = ({
	href,
	title,
	Icon
}) => {
	const pathname = usePathname()

	return (
		<Link
			href={href}
			className={cn(
				'flex items-center rounded-lg px-2 py-1 transition-colors',
				pathname === href ? 'bg-white/20' : 'hover:bg-white/20'
			)}
		>
			<Icon className='w-5' />
			<span className='ml-2'>{title}</span>
		</Link>
	)
}

export { SidebarNavElement }
