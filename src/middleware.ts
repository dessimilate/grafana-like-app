import { NextRequest, NextResponse } from 'next/server'

import { URLS } from './config/urls.config'

export function middleware(req: NextRequest) {
	const {
		url,
		nextUrl: { pathname }
	} = req

	if (pathname === '/') {
		return NextResponse.redirect(new URL(URLS.DASHBOARD, url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
