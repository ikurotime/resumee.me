'use server'

import { createClient } from '@/utils/supabase/server'
import { getWebsiteByUserId } from './websites'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(email: string, password: string) {
  const supabase = createClient()
  const data = {
    email,
    password
  }

  const {
    error,
    data: { user }
  } = await supabase.auth.signInWithPassword(data)
  if (!user || error) redirect('/error')

  const website = await getWebsiteByUserId(user.id)
  redirect(`/${website.page_slug}`)
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
