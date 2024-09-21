'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block, User, Website } from '@/types'

import { DraggableCard } from '@/components/DraggableCard'
import { EditableField } from '@/components/EditableField'
import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import { WebMenu } from '@/components/WebMenu'

export function CVBuilderLayout({
  user,
  website,
  isOwnProfile,
  onSave,
  onAddBlock,
  onDeleteBlock,
  moveCard,
  onResizeBlock
}: {
  user: User
  website: Website
  isOwnProfile: boolean
  onSave: (field: string, value: string) => void
  onAddBlock: () => void
  onDeleteBlock: (blockId: string) => void
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onResizeBlock: (blockId: string, width: number, height: number) => void
}) {
  return (
    <div className='h-screen flex flex-col'>
      <div className='flex flex-1 flex-grow container mx-auto px-4 py-14'>
        <div className='flex flex-1 flex-col md:flex-row gap-8'>
          <LeftColumn
            user={user}
            website={website}
            isOwnProfile={isOwnProfile}
            onSave={onSave}
          />
          <RightColumn
            website={website}
            isOwnProfile={isOwnProfile}
            onDeleteBlock={onDeleteBlock}
            moveCard={moveCard}
            onResizeBlock={onResizeBlock}
          />
        </div>
      </div>
      {isOwnProfile && <FloatingBottomBar onAddBlock={onAddBlock} />}
    </div>
  )
}

function LeftColumn({
  user,
  website,
  isOwnProfile,
  onSave
}: {
  user: User
  website: Website
  isOwnProfile: boolean
  onSave: (field: string, value: string) => void
}) {
  return (
    <div className='w-full md:w-1/3 relative'>
      <div className='flex flex-col items-left gap-4'>
        <Avatar className='w-44 h-44'>
          <AvatarImage src={user.profile_picture} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <EditableField
          value={website.title || ''}
          onSave={(value) => onSave('title', value)}
          isEditable={isOwnProfile}
          className='text-5xl font-bold'
          type='text'
        />
        <EditableField
          value={website.description || ''}
          onSave={(value) => onSave('bio', value)}
          isEditable={isOwnProfile}
          className='text-gray-500 text-xl'
          type='textarea'
        />
      </div>

      {isOwnProfile && (
        <div className='absolute bottom-0'>
          <WebMenu user={user} website={website} />
        </div>
      )}
    </div>
  )
}

function RightColumn({
  website,
  isOwnProfile,
  onDeleteBlock,
  moveCard,
  onResizeBlock
}: {
  website: Website
  isOwnProfile: boolean
  onDeleteBlock: (blockId: string) => void
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onResizeBlock: (blockId: string, width: number, height: number) => void
}) {
  return (
    <div className='w-full md:w-2/3'>
      <div className='grid grid-cols-4 gap-4'>
        {website?.blocks?.map((block: Block, index: number) => (
          <DraggableCard
            key={block.id}
            index={index}
            moveCard={moveCard}
            onDelete={() => onDeleteBlock(block.id)}
            isEditable={isOwnProfile}
            block={block}
            onResize={(width, height) => onResizeBlock(block.id, width, height)}
          />
        ))}
      </div>
    </div>
  )
}
