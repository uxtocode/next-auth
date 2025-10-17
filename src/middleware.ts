import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/signup' || path === '/login'
    const token = request.cookies.get('token')?.value || ''

    // If user is logged in and tries to access public pages
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If user is not logged in and tries to access protected pages
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow request to continue
    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/signup', '/login', '/u/:path*'],
}
