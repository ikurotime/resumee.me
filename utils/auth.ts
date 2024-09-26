import { Block } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { createWebsite } from '@/actions/websites'
import { v4 } from 'uuid'

export async function signUp(
  email: string,
  password: string,
  websiteName: string
) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) throw error
  if (data && data.user) {
    await createWebsite({
      user_id: data.user.id,
      page_name: websiteName,
      page_slug: v4(),
      blocks: getDefaultBlocks()
    })
  }
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  return user
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
