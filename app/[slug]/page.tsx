'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block, User, Website } from '@/types'
import { Plus, Users } from 'lucide-react'
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
import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import Loading from '@/components/Loading'
import { WebMenu } from '@/components/WebMenu'
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
  const [showExpandableInput, setShowExpandableInput] = useState(false)

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
      setWebsite((prevWebsite) => ({
        ...prevWebsite!,
        [field]: value
      }))

      try {
        const updatedWebsite = await updateWebsite(website.id!, {
          [field]: value
        })
        setWebsite(updatedWebsite)
        toast.success('Updated successfully')
      } catch (error) {
        console.error('Failed to update website:', error)
        setWebsite((prevWebsite) => ({
          ...prevWebsite!,
          [field]: prevWebsite![field as keyof Website]
        }))
        toast.error('Failed to update. Please try again.')
      }
    }
  }

  const handleAddBlock = () => {
    if (website) {
      const newBlock: Block = {
        id: Date.now().toString(),
        content: { title: 'New Block', description: 'Add your content here' },
        type: 'text'
      }
      setWebsite((prevWebsite) => ({
        ...prevWebsite!,
        blocks: [...(prevWebsite!.blocks || []), newBlock]
      }))
    }
  }

  const handleDeleteBlock = (blockId: string) => {
    if (website) {
      setWebsite((prevWebsite) => ({
        ...prevWebsite!,
        blocks: prevWebsite!.blocks.filter((block) => block.id !== blockId)
      }))
      // Here you would typically make an API call to delete the block from the backend
    }
  }

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (website) {
      const newBlocks = [...website.blocks]
      const draggedBlock = newBlocks[dragIndex]
      newBlocks.splice(dragIndex, 1)
      newBlocks.splice(hoverIndex, 0, draggedBlock)
      setWebsite((prevWebsite) => ({
        ...prevWebsite!,
        blocks: newBlocks
      }))
    }
  }

  if (!website) {
    return <Loading />
  }

  return (
    <div className='h-screen flex flex-col '>
      <ClientWrapper>
        <div className='flex flex-1 flex-grow container mx-auto px-4 py-8 '>
          <div className='flex flex-1 flex-col md:flex-row gap-8'>
            {/* Left Column */}
            <div className='w-full md:w-1/3 space-y-6 flex flex-col items-start relative'>
              <Avatar className='w-48 h-48 '>
                <AvatarImage
                  src={user?.profile_picture || ''}
                  alt={website.title || ''}
                />
                <AvatarFallback>
                  {website.title?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <EditableField
                type='text'
                value={website.title || ''}
                onSave={(newValue) => handleSave('title', newValue)}
                isEditable={isOwnProfile}
                className='text-5xl font-bold '
              />
              <EditableField
                type='textarea'
                value={website.description || ''}
                onSave={(newValue) => handleSave('description', newValue)}
                isEditable={isOwnProfile}
                className='text-xl text-gray-600 w-full overflow-auto h-[60%] resize-none'
              />

              {/* Button section */}
              <div className='absolute bottom-0 left-0 flex space-x-2'>
                <WebMenu user={user} website={website} />
                <Button variant='ghost' size='icon'>
                  <Users className='h-4 w-4 text-gray-500' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowExpandableInput(!showExpandableInput)}
                >
                  <Plus className='h-4 w-4 text-gray-500' />
                </Button>
              </div>
            </div>

            {/* Right Column */}
            <div className='w-full md:w-2/3 '>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {(website.blocks || []).map((block: Block, index: number) => (
                  <DraggableCard
                    key={block.id}
                    block={block}
                    isEditable={isOwnProfile}
                    onDelete={handleDeleteBlock}
                    index={index}
                    moveCard={moveCard}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {isOwnProfile && <FloatingBottomBar onAddBlock={handleAddBlock} />}
      </ClientWrapper>
    </div>
  )
}
