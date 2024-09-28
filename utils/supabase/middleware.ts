import { createWebsite } from '@/actions/websites'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { v4 } from 'uuid'
import { Block } from '@/types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => request.cookies.get(key)?.value,
        set: (key, value, options) => {
          request.cookies.set({ name: key, value, ...options })
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set({ name: key, value, ...options })
        },
        remove: (key, options) => {
          request.cookies.set({ name: key, value: '', ...options })
          supabaseResponse = NextResponse.next({ request })
          supabaseResponse.cookies.set({ name: key, value: '', ...options })
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup') ||
      request.nextUrl.pathname.startsWith('/auth')
    ) {
      const { data: website } = await supabase
        .from('websites')
        .select('page_slug')
        .eq('user_id', user.id)
        .single()

      if (!website?.page_slug) {
        const newSite = v4()
        await createWebsite({
          user_id: user.id,
          page_slug: newSite,
          blocks: getDefaultBlocks()
        })
        return redirectToUserPage(request, newSite)
      }

      return redirectToUserPage(request, website.page_slug)
    }
  }

  return supabaseResponse
}

function redirectToUserPage(request: NextRequest, slug: string) {
  const url = request.nextUrl.clone()
  url.pathname = `/${slug}`
  return NextResponse.redirect(url)
}

function getDefaultBlocks(): Block[] {
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
      imageUrl: '',
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
