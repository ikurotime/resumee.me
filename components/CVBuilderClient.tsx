'use client'

import { User, Website } from '@/types'
import { useEffect, useState } from 'react'

import { CVBuilder } from './CVBuilderLayout'
import Loading from './Loading'
import { SiteProvider } from '@/contexts/SiteContext'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'

export function CVBuilderClient({
  initialWebsite,
  initialUser
}: {
  initialWebsite: Website
  initialUser: User
}) {
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      setCurrentUser(user)
    }

    fetchUser()
  }, [supabase.auth])

  useEffect(() => {
    if (initialWebsite && initialUser && currentUser) {
      setIsLoading(false)
    }
  }, [initialWebsite, initialUser, currentUser])

  const isOwnProfile = currentUser?.id === initialWebsite?.user_id

  return (
    <SiteProvider initialWebsite={initialWebsite}>
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <CVBuilder user={initialUser} isOwnProfile={isOwnProfile} />
        )}
      </motion.div>
    </SiteProvider>
  )
}
