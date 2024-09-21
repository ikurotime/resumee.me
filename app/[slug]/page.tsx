'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block, Website } from '@/types'
import { useEffect, useState } from 'react'

import { ClientWrapper } from '@/components/ClientWrapper'
import { DraggableCard } from '@/components/DraggableCard'
import { EditableField } from '@/components/EditableField'
import { getWebsiteByPath } from '@/actions/websites'
import { useAuth } from '@/contexts/AuthContext'

export default function CVBuilderPage({
  params
}: {
  params: { slug: string }
}) {
  const { user } = useAuth()
  const [website, setWebsite] = useState<Website | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const websiteData = await getWebsiteByPath(params.slug)
      if (websiteData) {
        setWebsite(websiteData as Website)
        if (user) {
          setIsOwnProfile(user.id === websiteData.user_id)
        }
      }
    }
    fetchData()
  }, [params.slug, user])

  if (!website) {
    return <div>Loading...</div>
  }

  return (
    <ClientWrapper>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left Column */}
          <div className='w-full md:w-1/3 space-y-6'>
            <Avatar className='w-48 h-48 mx-auto'>
              <AvatarImage
                src={user?.profile_picture || ''}
                alt={website.cv_name || ''}
              />
              <AvatarFallback>
                {website.cv_name?.charAt(0) || ''}
              </AvatarFallback>
            </Avatar>
            <EditableField
              value={website.cv_name || ''}
              onSave={(newValue) => {
                /* Update name logic */
              }}
              isEditable={isOwnProfile}
              className='text-3xl font-bold text-center'
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
