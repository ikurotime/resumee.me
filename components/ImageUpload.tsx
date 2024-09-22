import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase-client'
import { useState } from 'react'
import { uuid } from 'uuidv4'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuid()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath)

      onUploadComplete(data.publicUrl)
    } catch (error) {
      alert('Error uploading image!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Button disabled={uploading}>
        {uploading ? 'Uploading ...' : 'Upload Image'}
      </Button>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute'
        }}
        type='file'
        id='single'
        accept='image/*'
        onChange={handleFileUpload}
        disabled={uploading}
      />
    </div>
  )
}
