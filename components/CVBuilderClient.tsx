'use client'

import { User, Website } from '@/types'

import { CVBuilderLayout } from './CVBuilderLayout'
import { ClientWrapper } from './ClientWrapper'
import Loading from './Loading'
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
  const {
    website,
    handleSave,
    handleAddBlock,
    handleDeleteBlock,
    moveCard,
    handleResizeBlock
  } = useWebsite(initialWebsite)
  const isOwnProfile = currentUser?.id === initialWebsite?.user_id

  if (!website) {
    return <Loading />
  }

  return (
    <ClientWrapper>
      <CVBuilderLayout
        user={initialUser}
        website={website}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
        onAddBlock={handleAddBlock}
        onDeleteBlock={handleDeleteBlock}
        moveCard={moveCard}
        onResizeBlock={handleResizeBlock}
      />
    </ClientWrapper>
  )
}
