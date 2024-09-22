'use client'

import { Block as BlockType, User } from '@/types'

import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import GridLayout from './GridLayout'
import { useSite } from '@/contexts/SiteContext'

export function CVBuilder({
  user,
  isOwnProfile
}: {
  user: User
  isOwnProfile: boolean
}) {
  const { website, saveWebsite } = useSite()

  const createNewBlock = (type: string, size: { w: number; h: number }) => {
    const newBlockId = `${website!.blocks.length}`
    const nextPosition = calculateNextPosition(website!.blocks)
    const newBlock = {
      i: newBlockId,
      x: nextPosition.x,
      y: nextPosition.y,
      w: size.w,
      h: size.h,
      isResizable: true,
      url: '',
      title: '',
      type: type
    }
    saveWebsite({ blocks: [...website!.blocks, newBlock] })
  }

  const handleAddProfileBlock = () => createNewBlock('profile', { w: 1, h: 1 })
  const handleAddDescriptionBlock = () => createNewBlock('info', { w: 2, h: 1 })
  const handleAddLinkBlock = () => createNewBlock('link', { w: 1, h: 1 })
  const handleAddImageBlock = () => createNewBlock('image', { w: 1, h: 1 })
  const handleAddNoteBlock = () => createNewBlock('note', { w: 1, h: 1 })

  const calculateNextPosition = (blocks: BlockType[]) => {
    const maxY = Math.max(...blocks.map((block) => block.y + block.h), 0)
    const lastRowBlocks = blocks.filter((block) => block.y + block.h === maxY)
    const maxXInLastRow = Math.max(
      ...lastRowBlocks.map((block) => block.x + block.w),
      0
    )

    if (maxXInLastRow + 1 <= 2) {
      // Assuming a grid width of 3
      return { x: maxXInLastRow, y: maxY - 1 }
    } else {
      return { x: 0, y: maxY }
    }
  }

  const HomeLayouts = {
    lg: website!.blocks,
    xs: website!.blocks.map((block) => ({ ...block, w: 1, h: 1 }))
  }
  return (
    <div className='flex flex-1 flex-col md:flex-row h-screen  overflow-y-scroll'>
      <GridLayout
        keys={website!.blocks}
        user={user}
        website={website!}
        layout={HomeLayouts}
      />
      {isOwnProfile && (
        <FloatingBottomBar
          onAddProfileBlock={handleAddProfileBlock}
          onAddDescriptionBlock={handleAddDescriptionBlock}
          onAddLinkBlock={handleAddLinkBlock}
          onAddImageBlock={handleAddImageBlock}
          onAddNoteBlock={handleAddNoteBlock}
          user={user}
        />
      )}
    </div>
  )
}

export default CVBuilder
