'use server'

import { signIn, signOut, signUp } from '@/utils/auth'

import { getWebsiteByUserId } from './websites'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(email: string, password: string) {
  try {
    const { user } = await signIn(email, password)
    if (!user) throw new Error('Login failed')

    const website = await getWebsiteByUserId(user.id)
    redirect(`/${website?.page_slug ?? ''}`)
  } catch (error) {
    console.error('Login error:', error)
    redirect('/error')
  }
}

export async function signup(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const websiteName = formData.get('websiteName') as string

    await signUp(email, password, websiteName)

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error('Signup error:', error)
    redirect('/error')
  }
}

export async function logout() {
  try {
    await signOut()
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    redirect('/error')
  }
}
