import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple in-memory cache to prevent too many refresh attempts
// Note: This is per-server-instance. For multi-instance deployments,
// consider using a distributed cache like Redis
const lastRefreshAttempt = {
  timestamp: 0,
  cooldownMs: 60 * 1000
}

export async function updateSession(request: NextRequest) {
  // Skip auth for webhook endpoints to allow GitHub to call them
  if (
    request.nextUrl.pathname.startsWith('/api/github/webhook')
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Verify the session is valid and not expired
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If we have a session, validate it but with throttling
    if (session) {
      const now = Date.now()
      
      // Only attempt to refresh the session once per minute to avoid rate limiting
      if (now - lastRefreshAttempt.timestamp > lastRefreshAttempt.cooldownMs) {
        lastRefreshAttempt.timestamp = now
        
        // This will fail if the GitHub access has been revoked
        const { error } = await supabase.auth.refreshSession()
        
        if (error) {
          console.error('Session refresh failed:', error.message)
          // Session is invalid - redirect to login
          const url = request.nextUrl.clone()
          url.pathname = '/auth/login'
          return NextResponse.redirect(url)
        }
      }
    }
  } catch (error) {
    console.error('Error verifying session:', error)
  }

  // No user session found or error occurred
  if (
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // no user, redirect to the login page
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
