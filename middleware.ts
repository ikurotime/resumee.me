import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // If user is signed in and the current path is / or /login or /signup, redirect to /[user's slug]
  if (
    user &&
    (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')
  ) {
    const { data: website } = await supabase
      .from('websites')
      .select('page_slug')
      .eq('user_id', user.id)
      .single()

    if (website) {
      return NextResponse.redirect(new URL(`/${website.page_slug}`, req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
