'use client'

import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import GridLayout from './GridLayout'
import { User } from '@/types'
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

  const handleAddBlock = () => {
    const newBlock = {
      i: `block-${blocks.length}`,
      x: 0,
      y: Infinity,
      w: 1,
      h: 1,
      isResizable: true
    }
    setBlocks([...blocks, newBlock])
    saveWebsite({ blocks: [...website!.blocks, newBlock] })
  }

  return (
    <div className='flex flex-1 flex-col md:flex-row h-screen overflow-hidden'>
      <GridLayout keys={blocks} user={user} website={website!} />
      {isOwnProfile && <FloatingBottomBar onAddBlock={handleAddBlock} />}
    </div>
  )
}

export default CVBuilderLayout
