'use server'

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

export async function addBlock(formData: FormData) {
  const websiteId = formData.get('websiteId') as string
  const blockTypeId = formData.get('blockTypeId') as string

  const { error } = await supabase.from('Blocks').insert({
    website_id: websiteId,
    block_type_id: blockTypeId,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    order_index: 0,
    content: {}
  })

  if (error) throw error

  revalidatePath('/cv-builder')
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

export async function getWebsiteByPath(pagePath: string) {
  const { data, error } = await supabase
    .from('websites')
    .select(
      `
      id,
      domain,
      title,
      cv_name,
      page_name,
      page_slug,
      is_cv_page,
      page_content,
      description,
      is_published,
      blocks (
        id,
        block_type_id,
        x,
        y,
        width,
        height,
        order_index,
        content
      )
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

export async function createWebsite(userId: string, pageName: string) {
  const { data, error } = await supabase.from('websites').insert({
    user_id: userId,
    page_name: pageName,
    domain: 'resumee.me',
    page_slug: pageName,
    is_cv_page: true,
    is_published: false
  })

  if (error) {
    console.error('Error creating website:', error)
    throw error
  }

  return data
}
