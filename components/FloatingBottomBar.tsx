import { Loader, Plus, Share } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TooltipComponent } from './TooltipComponent'
import { User } from '@/types'
import { WebMenu } from './WebMenu'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'

interface FloatingBottomBarProps {
  onAddBlock: () => void
  user: User
}

export function FloatingBottomBar({
  onAddBlock,
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
          {[...Array(5)].map((_, index) => (
            <TooltipComponent key={index} label='Settings'>
              <Button
                onClick={onAddBlock}
                variant='ghost'
                size='icon'
                className='w-10 h-10'
              >
                <Plus className='h-5 w-5' />
              </Button>
            </TooltipComponent>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
