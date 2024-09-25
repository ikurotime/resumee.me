'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useEffect, useState } from 'react'

import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'

interface ImageSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export function ImageSelectionModal({
  isOpen,
  onClose,
  onSelect
}: ImageSelectionModalProps) {
  const [images, setImages] = useState<string[]>([])
  const supabase = createClient()
  useEffect(() => {
    async function fetchImages() {
      const userId = (await supabase.auth.getSession()).data.session?.user.id
      const { data, error } = await supabase.storage.from('images').list(userId)

      if (error) {
        console.error('Error fetching images:', error)
        return
      }

      const imageUrls = data.map(
        (file) =>
          supabase.storage.from('images').getPublicUrl(`${userId}/${file.name}`)
            .data.publicUrl
      )

      setImages(imageUrls)
    }
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-3 gap-4'>
          {images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Uploaded image ${index + 1}`}
              className='w-full h-32 object-cover cursor-pointer'
              onClick={() => onSelect(imageUrl)}
            />
          ))}
        </div>
        <Button onClick={onClose}>Cancel</Button>
      </DialogContent>
    </Dialog>
  )
}
