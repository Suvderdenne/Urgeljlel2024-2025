import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionId = request.cookies.get('sessionid')?.value
  const isApiRoute = pathname.startsWith('/api/kiosk')
  const isAuthRoute = ['/login', '/register'].includes(pathname)
  const isProtectedRoute = ['/dashboard', '/transfer', '/deposit', '/withdraw'].some(route => 
    pathname.startsWith(route)
  )

  // 1. Handle API routes
  if (isApiRoute) {
    // Skip middleware for login API
    if (pathname === '/api/kiosk/login') {
      return NextResponse.next()
    }

    // Verify session for protected API endpoints
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Нэвтрэх шаардлагатай' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify session with Django backend
    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/verify-session/`, {
        headers: {
          Cookie: `sessionid=${sessionId}`
        }
      })

      if (!verifyResponse.ok) {
        throw new Error('Session verification failed')
      }

      return NextResponse.next()
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Session алдаа' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // 2. Handle page routes
  if (isAuthRoute && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedRoute && !sessionId) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transfer',
    '/deposit',
    '/withdraw',
    '/login',
    '/register',
    '/api/kiosk/:path*'
  ]
}