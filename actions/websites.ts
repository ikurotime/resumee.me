/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { Website } from '@/types'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase-server'

export async function searchWebsites(query: string) {
  const { data, error } = await supabase
    .from('websites')
    .select('id, page_slug')
    .ilike('page_slug', `%${query}%`)
    .limit(10)

  if (error) {
    console.error('Error searching websites:', error)
    return []
  }

  return data
}

export async function checkWebsiteExists(
  pageName: string
): Promise<{ exists: boolean; message?: string }> {
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

export async function getWebsiteByPath(pagePath: string) {
  const { data, error } = await supabase
    .from('websites')
    .select(
      `
      id,
      user_id,
      domain,
      title,
      cv_name,
      page_name,
      page_slug,
      is_cv_page,
      page_content,
      description,
      is_published,
      created_at,
      updated_at,
      blocks 
    `
    )
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
  const { data, error } = await supabase.from('websites').insert({
    user_id: website.user_id,
    page_name: website.page_name,
    domain: 'resumee.me',
    page_slug: website.page_slug,
    is_cv_page: true,
    is_published: false
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
  const { data, error } = await supabase.auth.updateUser({
    password
  })
  console.log(data, error)
  if (error) throw error
}

export async function updateWebsiteSlug(websiteId: string, slug: string) {
  const { error } = await supabase
    .from('websites')
    .update({ page_slug: slug })
    .eq('id', websiteId)
  if (error) throw error
  revalidatePath(`/${slug}`)
}
