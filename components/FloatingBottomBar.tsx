import {
  Image as ImageIcon,
  Link,
  Loader,
  PenBoxIcon,
  Share,
  Text,
  User
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TooltipComponent } from './TooltipComponent'
import { User as UserType } from '@/types'
import { WebMenu } from './WebMenu'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'

interface FloatingBottomBarProps {
  onAddProfileBlock: () => void
  onAddDescriptionBlock: () => void
  onAddLinkBlock: () => void
  onAddImageBlock: () => void
  onAddNoteBlock: () => void
  user: UserType
}

export function FloatingBottomBar({
  onAddProfileBlock,
  onAddDescriptionBlock,
  onAddLinkBlock,
  onAddImageBlock,
  onAddNoteBlock,
  user
}: FloatingBottomBarProps) {
  const handleShare = async () => {}
  const { isSaving, website } = useSite()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className='fixed bottom-4  transform right-0 left-0 bg-white rounded-full shadow-lg mx-auto max-w-3xl w-full'
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
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
          <TooltipComponent label='Profile picture'>
            <Button
              onClick={onAddProfileBlock}
              variant='ghost'
              size='icon'
              className='w-10 h-10'
            >
              <User className='h-5 w-5' />
            </Button>
          </TooltipComponent>
          <TooltipComponent label='Description'>
            <Button
              onClick={onAddDescriptionBlock}
              variant='ghost'
              size='icon'
              className='w-10 h-10'
            >
              <Text className='h-5 w-5' />
            </Button>
          </TooltipComponent>
          <TooltipComponent label='Link'>
            <Button
              onClick={onAddLinkBlock}
              variant='ghost'
              size='icon'
              className='w-10 h-10'
            >
              <Link className='h-5 w-5' />
            </Button>
          </TooltipComponent>

          <TooltipComponent label='Image'>
            <Button
              onClick={onAddImageBlock}
              variant='ghost'
              size='icon'
              className='w-10 h-10'
            >
              <ImageIcon className='h-6 w-6' />
            </Button>
          </TooltipComponent>
          <TooltipComponent label='New Note'>
            <Button
              onClick={onAddNoteBlock}
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
  )
}
