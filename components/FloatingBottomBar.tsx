import { Plus, Share, Share2 } from 'lucide-react'

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
      className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2'
    >
      <Button onClick={() => {}} variant='ghost' size='icon' className='mr-2'>
        <Share className='h-6 w-6' />
        <span>Share</span>
      </Button>
      <Button onClick={onAddBlock} variant='ghost' size='icon'>
        <Plus className='h-6 w-6' />
      </Button>
    </motion.div>
  )
}
