'use server'

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

export async function checkWebsiteExists(pageName: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('websites')
    .select('id', { count: 'exact', head: true })
    .eq('page_slug', pageName)

  if (error) {
    console.error('Error checking website existence:', error)
    throw error
  }

  return count !== null && count > 0
}
