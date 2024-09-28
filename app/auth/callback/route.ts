/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block } from '@/types'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createWebsite } from '@/actions/websites'
import { v4 } from 'uuid'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const site = searchParams.get('claim')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  const supabase = createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    console.error('Auth error:', error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  const { data: website } = await supabase
    .from('websites')
    .select('page_slug')
    .eq('user_id', user.id)
    .single()

  let redirectSlug = website?.page_slug

  if (!redirectSlug) {
    const newSite = site || v4()
    await createWebsite({
      user_id: user.id,
      page_slug: newSite,
      blocks: getDefaultBlocks(user)
    })
    redirectSlug = newSite
  }

  const redirectUrl = getRedirectUrl(request, origin, redirectSlug)
  return NextResponse.redirect(redirectUrl)
}

function getRedirectUrl(request: Request, origin: string, slug: string) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return `${origin}/${slug}`
  } else if (forwardedHost) {
    return `https://${forwardedHost}/${slug}`
  } else {
    return `${origin}/${slug}`
  }
}

function getDefaultBlocks(user: any): Block[] {
  return [
    {
      i: v4(),
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      isResizable: false,
      url: '',
      type: 'profile',
      imageUrl: user.user_metadata?.avatar_url || '',
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
}
