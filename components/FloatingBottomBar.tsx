'use client'

import { Block, User as UserType } from '@/types'
import {
  Image as ImageIcon,
  Link,
  Loader,
  PenBoxIcon,
  Share,
  Text,
  User
} from 'lucide-react'

import { AnimatedLinkInput } from './AnimatedLinkInput'
import { Button } from '@/components/ui/button'
import ColorWheel from './ColorWheel'
import { ImageUpload } from './ImageUpload'
import ShareModal from './ShareModal' // Add this import
import { TooltipComponent } from './TooltipComponent'
import { WebMenu } from './WebMenu'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

interface FloatingBottomBarProps {
  user: UserType
}

export function FloatingBottomBar({ user }: FloatingBottomBarProps) {
  const [isShareModalOpen, setShareModalOpen] = useState(false) // Add state for modal

  const handleShare = () => {
    const tweetContent = `Just made my new page. I can't wait to customize it! I'm going to have a cool link-in-bio ${
      'resumee.me/' + website?.page_slug
    }`

    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      tweetContent
    )}`
    window.open(tweetUrl, '_blank')
  }
  const { isSaving, website, saveWebsite } = useSite()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isPickerVisible, setPickerVisible] = useState(false)

  const handleAddProfileBlock = () =>
    createNewBlock({ type: 'profile', size: { w: 1, h: 1 } })
  const handleAddDescriptionBlock = () =>
    createNewBlock({ type: 'info', size: { w: 2, h: 1 } })
  const handleAddLinkBlock = (url: string, type: string) =>
    createNewBlock({ type, size: { w: 1, h: 1 }, url })
  const handleAddImageBlock = (imageUrl: string) =>
    createNewBlock({ type: 'image', size: { w: 1, h: 1 }, imageUrl })
  const handleAddNoteBlock = () =>
    createNewBlock({ type: 'note', size: { w: 1, h: 1 } })
  const handleColorPick = () => {
    setPickerVisible(!isPickerVisible)
  }
  const handleAddLink = (url: string) => {
    const domain = new URL(url).hostname.replace('www.', '')
    const type = domain.split('.')[0]
    handleAddLinkBlock(url, type)
    setShowLinkInput(false)
  }

  const handleAddImage = (url: string) => {
    handleAddImageBlock(url)
    setShowImageUpload(false)
  }

  const createNewBlock = ({
    type,
    size,
    url,
    imageUrl
  }: {
    type: string
    size: { w: number; h: number }
    url?: string
    imageUrl?: string
  }) => {
    const newBlockId = uuid()
    const nextPosition = calculateNextPosition(website!.blocks)
    const newBlock = {
      i: newBlockId,
      x: nextPosition.x,
      y: nextPosition.y,
      w: size.w,
      h: size.h,
      isResizable: true,
      url: url,
      title: '',
      type: type,
      imageUrl: imageUrl
    }
    saveWebsite({ blocks: [...website!.blocks, newBlock] })
  }

  const calculateNextPosition = (blocks: Block[]) => {
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

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className='fixed bottom-4 transform right-0 left-0 bg-white rounded-full shadow-lg mx-auto max-w-3xl w-full border'
      >
        <div className='flex items-center justify-between px-4 py-2'>
          <div className='flex gap-4 items-center'>
            <TooltipComponent label='Share tweet'>
              <Button
                onClick={handleShare}
                size='sm'
                className={`flex items-center gap-2 px-4 py-2 ${
                  isSaving ? 'bg-green-500 text-white' : ''
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  >
                    <Loader size={16} />
                  </motion.div>
                ) : (
                  <Share size={16} />
                )}
                <span>{isSaving ? 'Saving' : 'Share'}</span>
              </Button>
            </TooltipComponent>
            <WebMenu user={user} website={website!} />
          </div>

          <div className='flex items-center gap-2'>
            <ColorWheel
              isPickerVisible={isPickerVisible}
              onColorPick={handleColorPick}
            />
            <TooltipComponent label='Profile picture'>
              <Button
                onClick={handleAddProfileBlock}
                variant='ghost'
                size='icon'
                className='w-10 h-10'
              >
                <User className='h-5 w-5' />
              </Button>
            </TooltipComponent>
            <TooltipComponent label='Description'>
              <Button
                onClick={handleAddDescriptionBlock}
                variant='ghost'
                size='icon'
                className='w-10 h-10'
              >
                <Text className='h-5 w-5' />
              </Button>
            </TooltipComponent>
            <TooltipComponent label='Link'>
              <div className='relative'>
                <Button
                  onClick={() => setShowLinkInput(true)}
                  variant='ghost'
                  size='icon'
                  className='w-10 h-10'
                >
                  <Link className='h-5 w-5' />
                </Button>
                {showLinkInput && (
                  <AnimatedLinkInput
                    onSave={handleAddLink}
                    onCancel={() => setShowLinkInput(false)}
                  />
                )}
              </div>
            </TooltipComponent>

            <TooltipComponent label='Image'>
              <div className='relative'>
                <Button
                  onClick={() => setShowImageUpload(true)}
                  variant='ghost'
                  size='icon'
                  className='w-10 h-10'
                >
                  <ImageIcon className='h-6 w-6' />
                </Button>
                {showImageUpload && (
                  <ImageUpload
                    onUploadComplete={handleAddImage}
                    onCancel={() => setShowImageUpload(false)}
                  />
                )}
              </div>
            </TooltipComponent>
            <TooltipComponent label='New Note'>
              <Button
                onClick={handleAddNoteBlock}
                variant='ghost'
                size='icon'
                className='w-10 h-10'
              >
                <PenBoxIcon className='h-6 w-6' />
              </Button>
            </TooltipComponent>
          </div>
        </div>
      </motion.div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        pageLink={'resumee.me/' + website?.page_slug} // Pass the page link
      />
    </>
  )
}
