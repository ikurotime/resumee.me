import { Plus, Share } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface FloatingBottomBarProps {
  onAddBlock: () => void
}

export function FloatingBottomBar({ onAddBlock }: FloatingBottomBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className='fixed flex bottom-4 left-1/2 border transform -translate-x-1/2 bg-white rounded-full shadow-lg gap-4 p-4'
    >
      <Button
        onClick={() => {}}
        size='icon'
        className='w-full flex gap-2 px-2 py-1'
      >
        <Share size={16} />
        <span>Share</span>
      </Button>
      <Button
        onClick={onAddBlock}
        variant='ghost'
        className='w-full'
        size='icon'
      >
        <Plus className='h-6 w-6' />
      </Button>
    </motion.div>
  )
}
