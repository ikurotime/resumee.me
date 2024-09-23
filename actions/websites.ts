'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Website } from '@/types'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function checkWebsiteExists(
  pageName: string
): Promise<{ exists: boolean; message?: string }> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('websites')
    .select('id', { count: 'exact', head: true })
    .eq('page_slug', pageName)

  if (error) {
    console.error('Error checking website existence:', error)
    throw error
  }

  if (count !== null && count > 0) {
    return {
      exists: true,
      message:
        'This username seems to be taken already... Try something similar.'
    }
  }

  return { exists: false }
}

export async function getWebsiteByUserId(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error getting website by user id:', error)
    return null
  }
  return data
}

export async function getUserById(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Error getting user by id:', error)
    return null
  }
  return { data, error }
}

export async function updateUserProfilePic(
  userId: string,
  imageUrl: string,
  page_slug: string
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('users')
    .update({ profile_picture: imageUrl })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('Error updating user profile picture:', error)
    throw error
  }

  revalidatePath(`/${page_slug}`, 'layout')
  redirect(`/${page_slug}`)
}

export async function getWebsiteByPath(pagePath: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('page_slug', pagePath)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found
      return null
    }
    throw error
  }

  return data
}

export async function createWebsite(website: Website) {
  const supabase = createClient()
  const { data, error } = await supabase.from('websites').insert({
    user_id: website.user_id,
    page_name: website.page_name,
    domain: 'resumee.me',
    page_slug: website.page_slug,
    is_cv_page: true,
    is_published: false,
    blocks: website.blocks,
    page_content: '#f2f2f2'
  })

  if (error) {
    console.error('Error creating website:', error)
    throw error
  }

  return data
}

export async function updateWebsite(
  websiteId: string,
  updates: Partial<Website>
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('websites')
    .update(updates)
    .eq('id', websiteId)
    .select()
    .single()

  if (error) {
    console.error('Error updating website:', error)
    throw error
  }

  revalidatePath(`/${data.page_slug}`)
  return data as Website
}

export async function updatePassword(websiteId: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    password
  })

  if (error) throw error
}

export async function updateWebsiteSlug(websiteId: string, slug: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('websites')
    .update({ page_slug: slug })
    .eq('id', websiteId)
  if (error) throw error
  revalidatePath(`/${slug}`)
}
export async function addInterestedEmail(email: string) {
  const supabase = createClient()

  // First, check if the email already exists
  const { data: existingEmail, error: checkError } = await supabase
    .from('emails_interested')
    .select('email')
    .eq('email', email)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing email:', checkError)
    throw checkError
  }

  // If email doesn't exist, insert it
  if (!existingEmail) {
    const { error: insertError } = await supabase
      .from('emails_interested')
      .insert({ email })

    if (insertError) {
      console.error('Error inserting email:', insertError)
      throw insertError
    }

    console.log('Email added successfully:', email)
    return true
  } else {
    console.log('Email already exists:', email)
    return false
  }
}
