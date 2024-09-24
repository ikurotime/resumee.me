import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.4/mod.ts'
import React from 'https://esm.sh/react@18.2.0'
import { createClient } from 'jsr:@supabase/supabase-js@2'

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('site')

  // Create a Supabase client with the Auth context of the logged in user.
  console.log(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL'))
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! }
      }
    }
  )
  const { data } = await supabaseClient
    .from('websites')
    .select()
    .eq('page_slug', name)
    .single()
  const { data: user_data } = await supabaseClient
    .from('users')
    .select()
    .eq('id', data.user_id)

  console.log(data.user_id)
  console.log(user_data)

  const HEX_COLORS = [
    '#DC2626', // YouTube
    '#9333EA', // Twitch
    '#1F2937', // GitHub
    '#000000', // TikTok
    '#DB2777', // Instagram
    '#60A5FA', // Twitter
    '#1D4ED8', // LinkedIn
    '#2563EB', // Facebook
    '#B91C1C', // Pinterest
    '#FBBF24', // Snapchat
    '#EA580C', // Reddit
    '#1E40AF', // Tumblr
    '#22C55E', // WhatsApp
    '#3B82F6', // Telegram
    '#000000', // Medium
    '#16A34A', // Spotify
    '#F97316', // SoundCloud
    '#2563EB', // Behance
    '#EC4899', // Dribbble
    '#1D4ED8', // Vimeo
    '#F472B6', // Flickr
    '#166534', // DeviantArt
    '#EA580C', // Etsy
    '#EF4444', // Patreon
    '#4F46E5' // Discord
  ]

  // Function to get a random hex color
  function getRandomColor() {
    return HEX_COLORS[Math.floor(Math.random() * HEX_COLORS.length)]
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 128,
          background: 'white'
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '50%',
            height: '100%',
            padding: 82
          }}
        >
          {user_data[0]?.profile_picture ? (
            <img
              src={user_data[0].profile_picture}
              style={{ width: 228, height: 228, borderRadius: '12%' }}
            />
          ) : null}
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              top: 0,
              left: 0,
              color: 'black',
              padding: 16
            }}
          >
            {data.page_slug}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              border: '1px solid gray',
              borderRadius: '16% 0 0 16%',
              height: '100%'
            }}
          >
            <img />
          </div>
        </div>
      </div>
    )
  )
}

/*
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') ?? '',
    Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? ''
  )
  console.log(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL'))
  console.log(Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY'))
  const { data } = await supabaseClient
    .from('websites')
    .select()
    .eq('page_slug', 'ikurotime')
    .single()
  const user = data.user
  console.log(data)
  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  })
})

*/
