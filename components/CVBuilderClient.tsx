'use client'

import { User, Website } from '@/types'

import { CVBuilderLayout } from './CVBuilderLayout'
import { ClientWrapper } from './ClientWrapper'
import Loading from './Loading'
import { SiteProvider } from '@/contexts/SiteContext'
import { useAuth } from '@/contexts/AuthContext'
import { useWebsite } from '@/hooks/index'

export function CVBuilderClient({
  initialWebsite,
  initialUser
}: {
  initialWebsite: Website
  initialUser: User
}) {
  const { user: currentUser } = useAuth()
  const { website, handleSave } = useWebsite(initialWebsite)
  const isOwnProfile = currentUser?.id === initialWebsite?.user_id

  if (!website) {
    return <Loading />
  }

  return (
    <ClientWrapper>
      <SiteProvider initialWebsite={initialWebsite}>
        <CVBuilderLayout
          user={initialUser}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
      </SiteProvider>
    </ClientWrapper>
  )
}
