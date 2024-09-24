import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { createWebsite } from '@/actions/websites'
import { v4 } from 'uuid'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code') ?? ''
  const site = searchParams.get('claim')
  // if "next" is in param, use it as the redirect URL
  //const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const {
      data: { user },
      error
    } = await supabase.auth.exchangeCodeForSession(code)
    const { data } = await supabase
      .from('websites')
      .select('page_slug')
      .eq('user_id', user?.id)
      .single()
    if (user && site) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      createWebsite({
        user_id: user.id,
        page_slug: site,
        blocks: [
          {
            i: v4(),
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            isResizable: false,
            url: '',
            type: 'profile',
            imageUrl: data.profile_picture,
            content: '',
            title: '',
            fullSizedImage: false
          },
          {
            i: v4(),
            x: 2,
            y: 0,
            w: 2,
            h: 1,
            isResizable: false,
            url: '',
            type: 'info',
            title: 'Welcome to your page!',
            content: 'Use the buttons below to add some cards.',
            imageUrl: '',
            fullSizedImage: false
          }
        ]
      })
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}/${site ?? data?.page_slug}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}/${site ?? data?.page_slug}`
        )
      } else {
        return NextResponse.redirect(`${origin}/${site ?? data?.page_slug}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
