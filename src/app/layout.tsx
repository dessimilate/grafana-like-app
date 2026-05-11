import { Metadata } from 'next/dist/lib/metadata/types/metadata-interface';
import { JetBrains_Mono } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { MainProvider } from '@/components/providers/MainProvider';

import { SITE_NAME } from '@/config/seo.constant';

import './globals.css';

const font = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: 'Grafana like website'
}

export default function LocaleLayout({
	children
}: Readonly<PropsWithChildren>) {
	return (
		// Предполагается что сайт находится в RU сегменте. Что значит
		// нужно указать lang='ru' для корректной работы скринридеров и SEO.
		// SSR/SSG в Next.js улучшают SEO, поэтому неверный lang — серьёзная ошибка для SEO-ориентированного проекта
		<html lang='ru'>
			<body className={font.className}>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	)
}
