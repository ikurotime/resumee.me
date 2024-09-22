import { BlockProps, GridLayoutProps } from '@/types'
import { Grip, SquareArrowOutUpRightIcon } from 'lucide-react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import { useMemo, useState } from 'react'

import { EditableField } from '@/components/EditableField'
import ImageAvatarToggleBlock from './ImageAvatarToggleBlock'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'

const DeleteButton = ({ id }: { id: string }) => {
  const { deleteBlock } = useSite()

  return (
    <button
      onClick={() => {
        deleteBlock(id)
      }}
      className='bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
      </svg>
    </button>
  )
}
function GridLayout({ user }: GridLayoutProps) {
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), [])
  const { saveBlockOrder, website } = useSite()
  const layout = {
    lg: website!.blocks,
    xs: website!.blocks
  }

  const onLayoutChange = (layout: Layout[]) => {
    // Check if the order has changed before saving
    const hasOrderChanged = layout.some((item, index) => {
      const originalBlock = website!.blocks[index]
      return (
        item.x !== originalBlock.x ||
        item.y !== originalBlock.y ||
        item.w !== originalBlock.w ||
        item.h !== originalBlock.h
      )
    })

    if (!hasOrderChanged) {
      console.log('has NOT changed')
      return // Exit the function if no changes detected
    }
    console.log('has changed')
    const newOrder = layout.map((item) => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    }))

    saveBlockOrder(newOrder)
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }
  const handleCardSelect = (draggedElement: HTMLElement) => {
    const selectedCard = draggedElement.querySelector('.colored')

    if (selectedCard) {
      const computedStyle = window.getComputedStyle(selectedCard)
      const backgroundColor = computedStyle.backgroundColor

      const rgbaColor = backgroundColor.replace(
        /rgba?\((\d+), (\d+), (\d+)(?:, (\d+\.?\d*))?\)/,
        (match, r, g, b) => {
          return `rgba(${r}, ${g}, ${b}, 0.138)`
        }
      )

      document.documentElement.style.setProperty(
        '--selected-card-background',
        rgbaColor
      )
    } else {
      document.documentElement.style.setProperty(
        '--selected-card-background',
        'rgba(0, 0, 0, 0.138)' // Default color for selected card
      )
    }
  }
  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      variants={containerVariants}
      className='w-[900px] m-auto flex justify-between b-10 relative'
    >
      <ResponsiveReactGridLayout
        className='m-auto w-[900px]'
        breakpoints={{ xl: 1200, lg: 899, md: 768, sm: 480, xs: 200 }}
        cols={{ xl: 12, lg: 3, md: 2, sm: 1, xs: 1 }}
        rowHeight={300}
        layouts={layout}
        draggableHandle='.draggable_handle'
        onDrag={(layout, oldItem, newItem, placeholder, e, element) => {
          handleCardSelect(element)
        }}
        onDragStop={onLayoutChange}
      >
        {website!.blocks.map((block) => (
          <motion.div
            key={block.i}
            variants={itemVariants}
            className='bg-[#fff] relative shadow border flex justify-center items-center rounded-2xl text-2xl text-[#1d1d1f] visible cursor-grab active:cursor-grabbing group'
          >
            <div className='absolute z-[9999] -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
              <DeleteButton id={block.i} />
            </div>
            <div className='absolute draggable_handle z-[9999] -top-5 -left-5 opacity-0 size-12 items-center flex justify-center   group-hover:opacity-100 transition-opacity'>
              <div className='bg-white rounded-full size-8 justify-center flex items-center border'>
                <Grip id={block.i} size={16} />
              </div>
            </div>

            <Block block={block} user={user} />
          </motion.div>
        ))}
      </ResponsiveReactGridLayout>
    </motion.div>
  )
}

export function Block({ block, user }: BlockProps) {
  const { website, saveWebsite } = useSite()
  const [title, setTitle] = useState(block.title || '') // State for block title
  const [description, setDescription] = useState(block?.content || '') // State for description
  const [noteContent, setNoteContent] = useState(block.content || '') // State for note content

  const handleTitleSave = (newTitle: string) => {
    setTitle(newTitle)
    const updatedBlocks = website!.blocks.map((b) => {
      if (b.i === block.i) {
        return { ...b, title: newTitle } // Update the title of the modified block
      }
      return b
    })
    saveWebsite({ blocks: updatedBlocks }) // Save the updated blocks
  }

  const handleDescriptionSave = (newContent: string) => {
    setDescription(newContent)
    const updatedBlocks = website!.blocks.map((b) => {
      if (b.i === block.i) {
        return { ...b, content: newContent } // Update the content of the modified block
      }
      return b
    })
    saveWebsite({ blocks: updatedBlocks })
  }

  const handleNoteContentSave = (newNoteContent: string) => {
    setNoteContent(newNoteContent)
    const updatedBlocks = website!.blocks.map((b) => {
      if (b.i === block.i) {
        return { ...b, content: newNoteContent } // Update the content of the modified block
      }
      return b
    })
    saveWebsite({ blocks: updatedBlocks }) // Save the updated blocks
  }

  const blockContent = () => {
    const { type } = block
    const social = SOCIAL_CARD_STYLES[type as keyof typeof SOCIAL_CARD_STYLES]

    if (social) {
      return (
        <div
          className={`colored ${social.bgColor} text-white p-4 rounded-2xl flex h-full overflow-hidden w-full relative`}
        >
          <EditableField
            value={title} // Use the block's title directly
            onSave={handleTitleSave} // Save the block title
            isEditable={true}
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
          />
        )
      case 'info':
        return (
          <div className='flex flex-col px-8 w-full'>
            <EditableField
              value={title} // Use the block's title directly
              onSave={handleTitleSave}
              isEditable={true}
              className='text-4xl font-bold mb-2 cursor-text'
              type='text'
            />
            <EditableField
              value={description} // Use the block's description directly
              onSave={handleDescriptionSave}
              isEditable={true}
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
            />
          </div>
        )
      case 'note':
        return (
          <div className='w-full h-full overflow-hidden flex flex-col p-5'>
            <EditableField
              value={title} // Use the block's title directly
              onSave={handleTitleSave}
              isEditable={true}
              className='text-gray-600 cursor-text flex w-full font-bold text-xl'
              type='text'
            />
            <EditableField
              value={noteContent || 'Edit me! '} // Use the note content
              onSave={handleNoteContentSave}
              isEditable={true}
              className='text-gray-600 cursor-text flex w-full text-base h-full resize-none'
              type='textarea'
            />
          </div>
        )
      default:
        return <div>Block: {block.i}</div>
    }
  }

  return blockContent()
}

const SOCIAL_CARD_STYLES = {
  youtube: { bgColor: 'bg-red-600', title: 'YouTube' },
  twitch: { bgColor: 'bg-purple-600', title: 'Twitch' },
  github: { bgColor: 'bg-gray-800', title: 'GitHub' },
  tiktok: { bgColor: 'bg-black', title: 'TikTok' },
  instagram: { bgColor: 'bg-pink-600', title: 'Instagram' },
  twitter: { bgColor: 'bg-blue-400', title: 'Twitter' },
  linkedin: { bgColor: 'bg-blue-700', title: 'LinkedIn' },
  facebook: { bgColor: 'bg-blue-600', title: 'Facebook' },
  pinterest: { bgColor: 'bg-red-700', title: 'Pinterest' },
  snapchat: { bgColor: 'bg-yellow-400', title: 'Snapchat' },
  reddit: { bgColor: 'bg-orange-600', title: 'Reddit' },
  tumblr: { bgColor: 'bg-blue-800', title: 'Tumblr' },
  whatsapp: { bgColor: 'bg-green-500', title: 'WhatsApp' },
  telegram: { bgColor: 'bg-blue-500', title: 'Telegram' },
  medium: { bgColor: 'bg-black', title: 'Medium' },
  spotify: { bgColor: 'bg-green-600', title: 'Spotify' },
  soundcloud: { bgColor: 'bg-orange-500', title: 'SoundCloud' },
  behance: { bgColor: 'bg-blue-600', title: 'Behance' },
  dribbble: { bgColor: 'bg-pink-500', title: 'Dribbble' },
  vimeo: { bgColor: 'bg-blue-700', title: 'Vimeo' },
  flickr: { bgColor: 'bg-pink-400', title: 'Flickr' },
  deviantart: { bgColor: 'bg-green-800', title: 'DeviantArt' },
  etsy: { bgColor: 'bg-orange-600', title: 'Etsy' },
  patreon: { bgColor: 'bg-red-500', title: 'Patreon' },
  discord: { bgColor: 'bg-indigo-600', title: 'Discord' }
}
export default GridLayout
