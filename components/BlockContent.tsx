/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditableField } from '@/components/EditableField'
import ImageAvatarToggleBlock from './ImageAvatarToggleBlock'
import { SOCIAL_CARD_STYLES } from './GridLayoutHelper'
import { SquareArrowOutUpRightIcon } from 'lucide-react'

export function renderBlockContent(
  block: any,
  user: any,
  isOwnProfile: boolean,
  handleSave: (field: string, value: string) => void
) {
  const { type } = block
  const social = SOCIAL_CARD_STYLES[type as keyof typeof SOCIAL_CARD_STYLES]

  if (social) {
    return (
      <div
        className={`colored ${social.bgColor} text-white p-4 rounded-2xl flex h-full overflow-hidden w-full relative`}
      >
        <EditableField
          value={block.title || ''}
          onSave={(newTitle) => handleSave('title', newTitle)}
          isEditable={isOwnProfile}
          className={`text-xl font-bold mb-2 cursor-text ${social.bgColor} focus:ring-offset-0 focus:ring-0`}
          type='text'
        />
        <a
          href={block.url}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-white rounded-full size-16 flex items-center justify-center bottom-5 left-5 absolute'
        >
          <SquareArrowOutUpRightIcon color='black' />
        </a>
      </div>
    )
  }

  switch (type) {
    case 'profile':
      return (
        <ImageAvatarToggleBlock
          imageSrc={user?.profile_picture || ''}
          userName={user.name || 'User'}
          editable={isOwnProfile}
          block={block}
        />
      )
    case 'info':
      return (
        <div className='flex flex-col px-8 w-full'>
          <EditableField
            value={block.title || ''}
            onSave={(newTitle) => handleSave('title', newTitle)}
            isEditable={isOwnProfile}
            className='text-4xl font-bold mb-2 cursor-text'
            type='text'
          />
          <EditableField
            value={block.content || ''}
            onSave={(newContent) => handleSave('content', newContent)}
            isEditable={isOwnProfile}
            className='text-gray-600 cursor-text flex w-full'
            type='textarea'
          />
        </div>
      )
    case 'image':
      return (
        <div className='w-full h-full overflow-hidden flex'>
          <ImageAvatarToggleBlock
            imageSrc={block.imageUrl || ''}
            userName={'Image'}
            editable={isOwnProfile}
            block={block}
          />
        </div>
      )
    case 'note':
      return (
        <div className='w-full h-full overflow-hidden flex flex-col p-5'>
          <EditableField
            value={block.title || ''}
            onSave={(newTitle) => handleSave('title', newTitle)}
            isEditable={isOwnProfile}
            className='text-gray-600 cursor-text flex w-full font-bold text-xl'
            type='text'
          />
          <EditableField
            value={block.content || 'Edit me! '}
            onSave={(newContent) => handleSave('content', newContent)}
            isEditable={isOwnProfile}
            className='text-gray-600 cursor-text flex w-full text-base h-full resize-none'
            type='textarea'
          />
        </div>
      )
    default:
      return <div>Block: {block.i}</div>
  }
}
