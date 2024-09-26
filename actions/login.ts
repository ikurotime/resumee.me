'use server'

import { signIn, signOut, signUp } from '@/utils/auth'

import { getWebsiteByUserId } from './websites'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(email: string, password: string) {
  const { user } = await signIn(email, password)
  if (!user) {
    redirect('/login?error=Login failed')
  }

  const website = await getWebsiteByUserId(user.id)
  redirect(`/${website?.page_slug ?? ''}`)
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const websiteName = formData.get('websiteName') as string

  await signUp(email, password, websiteName)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  await signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
