'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block, User, Website } from '@/types'
import { Settings, Users } from 'lucide-react'
import {
  getUserById,
  getWebsiteByPath,
  updateWebsite
} from '@/actions/websites'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ClientWrapper } from '@/components/ClientWrapper'
import { DraggableCard } from '@/components/DraggableCard'
import { EditableField } from '@/components/EditableField'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function CVBuilderPage({
  params
}: {
  params: { slug: string }
}) {
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [website, setWebsite] = useState<Website | null>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const websiteData = await getWebsiteByPath(params.slug)
      const user = await getUserById(websiteData?.user_id)
      setUser(user?.data)

      if (websiteData) {
        setWebsite(websiteData as Website)
        if (currentUser) {
          setIsOwnProfile(currentUser.id === websiteData.user_id)
        }
      }
    }
    fetchData()
  }, [params.slug, currentUser])

  const handleSave = async (field: string, value: string) => {
    if (website) {
      // Optimistic update
      setWebsite((prevWebsite) => ({
        ...prevWebsite!,
        [field]: value
      }))

      try {
        const updatedWebsite = await updateWebsite(website.id!, {
          [field]: value
        })
        // Update with server response (in case of any discrepancies)
        setWebsite(updatedWebsite)
        toast.success('Updated successfully')
      } catch (error) {
        console.error('Failed to update website:', error)
        // Revert the optimistic update
        setWebsite((prevWebsite) => ({
          ...prevWebsite!,
          [field]: prevWebsite![field as keyof Website]
        }))
        toast.error('Failed to update. Please try again.')
      }
    }
  }

  if (!website) {
    return <div>Loading...</div>
  }

  return (
    <ClientWrapper>
      <div className='flex flex-1 h-full container mx-auto px-4 py-8 '>
        <div className='flex flex-1 flex-col md:flex-row gap-8'>
          {/* Left Column */}
          <div className='w-full md:w-1/3 flex-1 space-y-6 flex flex-col items-start relative'>
            <Avatar className='w-48 h-48 '>
              <AvatarImage
                src={user?.profile_picture || ''}
                alt={website.title || ''}
              />
              <AvatarFallback>{website.title?.charAt(0) || ''}</AvatarFallback>
            </Avatar>
            <EditableField
              value={website.title || ''}
              onSave={(newValue) => handleSave('title', newValue)}
              isEditable={isOwnProfile}
              className='text-5xl font-bold '
            />
            <EditableField
              value={website.description || ''}
              onSave={(newValue) => handleSave('description', newValue)}
              isEditable={isOwnProfile}
              className='text-xl text-gray-600'
            />

            {/* Button section */}
            {isOwnProfile ? (
              <div className='absolute bottom-0 left-0 flex space-x-2'>
                <Button variant='ghost' size='icon'>
                  <Settings className='h-4 w-4 text-gray-500' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <Users className='h-4 w-4 text-gray-500' />
                </Button>
              </div>
            ) : (
              <div className='absolute bottom-0 left-0 flex space-x-4 items-center'>
                <Link href='/signup'>
                  <Button className='w-full'>Create your Resumee</Button>
                </Link>
                <Link href='/login' className='text-gray-500 text-sm'>
                  Login
                </Link>
              </div>
            )}
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
