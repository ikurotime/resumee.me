'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block, Website } from '@/types'
import { getUserById, getWebsiteByPath } from '@/actions/websites'
import { useEffect, useState } from 'react'

import { ClientWrapper } from '@/components/ClientWrapper'
import { DraggableCard } from '@/components/DraggableCard'
import { EditableField } from '@/components/EditableField'
import { useAuth } from '@/contexts/AuthContext'

export default function CVBuilderPage({
  params
}: {
  params: { slug: string }
}) {
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [website, setWebsite] = useState<Website | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.id) {
        const user = await getUserById(currentUser.id)
        console.log({ user })
        setUser(user?.data)
      }

      const websiteData = await getWebsiteByPath(params.slug)
      if (websiteData) {
        setWebsite(websiteData as Website)
        if (currentUser) {
          setIsOwnProfile(currentUser.id === websiteData.user_id)
        }
      }
    }
    fetchData()
  }, [params.slug, currentUser])

  if (!website) {
    return <div>Loading...</div>
  }

  return (
    <ClientWrapper>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left Column */}
          <div className='w-full md:w-1/3 space-y-6 flex flex-col items-start'>
            <Avatar className='w-48 h-48 '>
              <AvatarImage
                src={user?.profile_picture || ''}
                alt={website.title || ''}
              />
              <AvatarFallback>{website.title?.charAt(0) || ''}</AvatarFallback>
            </Avatar>
            <EditableField
              value={website.title || ''}
              onSave={(newValue) => {
                /* Update name logic */
              }}
              isEditable={isOwnProfile}
              className='text-3xl font-bold '
            />
            <EditableField
              value={website.description || ''}
              onSave={(newValue) => {
                console.log(newValue)
              }}
              isEditable={isOwnProfile}
              className='text-lg text-gray-600'
            />
          </div>

          {/* Right Column */}
          <div className='w-full md:w-2/3'>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {(website.blocks || []).map((block: Block) => (
                <DraggableCard
                  key={block.id}
                  block={block}
                  isEditable={isOwnProfile}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
