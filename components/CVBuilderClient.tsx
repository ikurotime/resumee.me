'use client'

import { User, Website } from '@/types'
import { useEffect, useState } from 'react'

import { CVBuilder } from './CVBuilderLayout'
import Loading from './Loading'
import { SiteProvider } from '@/contexts/SiteContext'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export function CVBuilderClient({
  initialWebsite,
  initialUser
}: {
  initialWebsite: Website
  initialUser: User
}) {
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (initialWebsite && initialUser) {
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
