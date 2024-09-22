'use client'

import { Block as BlockType, User } from '@/types'

import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import GridLayout from './GridLayout'
import { useSite } from '@/contexts/SiteContext'
import { useState } from 'react'

export function CVBuilderLayout({
  user,
  isOwnProfile
}: {
  user: User
  isOwnProfile: boolean
  onSave: (field: string, value: string) => void
}) {
  const { website, saveWebsite } = useSite()
  const [blocks, setBlocks] = useState(website!.blocks)
  console.log({ website })
  const handleAddBlock = () => {
    const newBlockId = `block-${blocks.length}`
    const nextPosition = calculateNextPosition(blocks)
    const newBlock = {
      i: newBlockId,
      x: nextPosition.x,
      y: nextPosition.y,
      w: 1,
      h: 1,
      isResizable: true,
      url: '',
      title: ''
    }
    setBlocks([...blocks, newBlock])
    saveWebsite({ blocks: [...website!.blocks, newBlock] })
  }

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
        keys={blocks}
        user={user}
        website={website!}
        layout={HomeLayouts}
      />
      {isOwnProfile && (
        <FloatingBottomBar onAddBlock={handleAddBlock} user={user} />
      )}
    </div>
  )
}

export default CVBuilderLayout
