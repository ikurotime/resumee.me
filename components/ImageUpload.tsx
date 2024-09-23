'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { ImageSelectionModal } from './ImageSelectionModal'
import { Upload } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { updateUserProfilePic } from '@/actions/websites'
import { useSite } from '@/contexts/SiteContext'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  onCancel: () => void
}

export function ImageUpload({ onUploadComplete, onCancel }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isProfileImage, setIsProfileImage] = useState(false)
  const { website } = useSite()
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const supabase = createClient()
      const user = await supabase.auth.getUser()
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuid()}.${fileExt}`

      const filePath = `${user.data.user?.id}/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)
      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)

      const user_id = user.data?.user?.id

      if (isProfileImage && user_id) {
        console.log({ user_id, url: data.publicUrl })
        updateUserProfilePic(user_id, data.publicUrl, website?.page_slug ?? '/')
      } else {
        onUploadComplete(data.publicUrl)
      }
    } catch (error) {
      alert('Error uploading image!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSelectImage = (url: string) => {
    onUploadComplete(url)
    setShowModal(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className='absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-4 min-w-64'
      >
        <input
          type='file'
          id='imageUpload'
          accept='image/*'
          onChange={handleFileUpload}
          className='hidden'
        />
        <label
          htmlFor='imageUpload'
          className='flex gap-4 items-center cursor-pointer text-sm  mb-2 px-4 py-2 bg-blue-500 w-full text-white rounded hover:bg-blue-600 transition-colors'
        >
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload New Image'}
        </label>
        <label
          htmlFor='imageUpload'
          onClick={() => setIsProfileImage(true)}
          className='flex gap-4 items-center cursor-pointer text-sm  mb-2 px-4 py-2 bg-green-500 w-full text-white rounded hover:bg-green-600 transition-colors'
        >
          <Upload size={16} />{' '}
          {uploading ? 'Uploading...' : 'Upload Profile Image'}
        </label>
        <div className='flex justify-between  mt-2'>
          <Button variant='outline' size='sm' onClick={onCancel}>
            Cancel
          </Button>
          <Button size='sm' onClick={() => setShowModal(true)}>
            Select Existing Image
          </Button>
        </div>
        <ImageSelectionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectImage}
        />
      </motion.div>
    </AnimatePresence>
  )
}
