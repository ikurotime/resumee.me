'use client'

import { User, Website } from '@/types'

import { CVBuilderLayout } from './CVBuilderLayout'
import { ClientWrapper } from './ClientWrapper'
import { SiteProvider } from '@/contexts/SiteContext'
import { useAuth } from '@/contexts/AuthContext'

export function CVBuilderClient({
  initialWebsite,
  initialUser
}: {
  initialWebsite: Website
  initialUser: User
}) {
  const { user: currentUser } = useAuth()
  const isOwnProfile = currentUser?.id === initialWebsite?.user_id

  return (
    <ClientWrapper>
      <SiteProvider initialWebsite={initialWebsite}>
        <CVBuilderLayout user={initialUser} isOwnProfile={isOwnProfile} />
      </SiteProvider>
    </ClientWrapper>
  )
}
