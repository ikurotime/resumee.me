import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image as ImageIcon, UserCircle } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TooltipComponent } from './TooltipComponent'

interface ImageAvatarToggleBlockProps {
  imageSrc: string
  userName: string
}

const ImageAvatarToggleBlock: React.FC<ImageAvatarToggleBlockProps> = ({
  imageSrc,
  userName
}) => {
  const [showAvatar, setShowAvatar] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleShowAvatar = () => {
    setShowAvatar(true)
  }

  const handleShowImage = () => {
    setShowAvatar(false)
  }

  return (
    <div
      className='w-full h-full  overflow-hidden flex  justify-center items-center relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showAvatar ? (
        <Avatar className='w-48 h-48 mb-4'>
          <AvatarImage src={imageSrc} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <img
          src={imageSrc}
          alt={'Uploaded image'}
          className='w-full h-full object-cover rounded-2xl pointer-events-none select-none'
        />
      )}
      {isHovered && (
        <div className='flex justify-center space-x-2 absolute bottom-4'>
          <TooltipComponent label='Show Avatar'>
            <Button onClick={handleShowAvatar} variant='outline'>
              <UserCircle size={20} />
            </Button>
          </TooltipComponent>
          <TooltipComponent label='Show Full Image'>
            <Button onClick={handleShowImage} variant='outline'>
              <ImageIcon size={20} />
            </Button>
          </TooltipComponent>
        </div>
      )}
    </div>
  )
}

export default ImageAvatarToggleBlock
