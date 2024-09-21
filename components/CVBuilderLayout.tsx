'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Website } from '@/types'

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
    <div className='flex flex-1 flex-col md:flex-row h-screen overflow-hidden'>
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
    <div className='w-full md:w-2/5 h-full overflow-hidden p-14 flex flex-col justify-between'>
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
        <div>
          <WebMenu user={user} website={website} />
        </div>
      )}
    </div>
  )
}

interface RightColumnProps {
  website: Website
  isOwnProfile: boolean
  onDeleteBlock: (blockId: string) => void
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onResizeBlock: (blockId: string, width: number, height: number) => void
}

function RightColumn({
  website,
  isOwnProfile,
  onDeleteBlock,
  moveCard,
  onResizeBlock
}: RightColumnProps) {
  return (
    <div className='flex flex-1 h-full  overflow-y-scroll p-4 bg-slate-500'>
      <div className='grid grid-cols-4 grid-rows-5 gap-4'>
        {website.blocks.map((block, index) => (
          <DraggableCard
            key={block.id}
            index={index}
            block={block}
            isEditable={isOwnProfile}
            onDelete={onDeleteBlock}
            moveCard={moveCard}
            onChangeSize={(blockid, width, height) =>
              onResizeBlock(blockid, width, height)
            }
          />
        ))}
      </div>
    </div>
  )
}

export default CVBuilderLayout
