import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AnimatedLinkInputProps {
  onSave: (url: string) => void
  onCancel: () => void
}

export function AnimatedLinkInput({
  onSave,
  onCancel
}: AnimatedLinkInputProps) {
  const [url, setUrl] = useState('')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className='absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-4 min-w-64'
      >
        <Input
          type='url'
          placeholder='Enter URL'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className='mb-2'
        />
        <div className='flex justify-end space-x-2'>
          <Button variant='outline' size='sm' onClick={onCancel}>
            Cancel
          </Button>
          <Button size='sm' onClick={() => onSave(url)}>
            Save
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
