import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block as BlockType, User, Website } from '@/types'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import { useMemo, useState } from 'react'

import { ImageUpload } from './ImageUpload'
import { motion } from 'framer-motion'
import { useSite } from '@/contexts/SiteContext'

interface BlockProps {
  keyProp: string
  user: User
  website: Website
  url?: string
  title?: string
  type?: string
}
interface GridLayoutProps {
  keys: BlockType[]
  user: User
  website: Website
  layout: {
    lg: BlockType[]
    xs: BlockType[]
  }
}
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
function GridLayout({ keys, user, website, layout }: GridLayoutProps) {
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), [])
  const { saveBlockOrder } = useSite()

  const onLayoutChange = (layout: Layout[]) => {
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
        onDragStop={onLayoutChange}
      >
        {keys.map((key) => (
          <motion.div
            key={key.i}
            variants={itemVariants}
            className='bg-[#fff] relative shadow border flex justify-center items-center rounded-2xl text-2xl text-[#1d1d1f] visible cursor-grab active:cursor-grabbing group'
          >
            <div className='absolute z-[9999] -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
              <DeleteButton id={key.i} />
            </div>
            <Block
              keyProp={key.i}
              user={user}
              website={website}
              url={key.url}
              title={key.title}
              type={key.type}
            />
          </motion.div>
        ))}
      </ResponsiveReactGridLayout>
    </motion.div>
  )
}

export function Block({
  keyProp,
  user,
  website,
  url,
  title,
  type
}: BlockProps) {
  const { saveWebsite } = useSite()
  const [imageUrl, setImageUrl] = useState(url)

  const handleImageUpload = (uploadedUrl: string) => {
    setImageUrl(uploadedUrl)
    saveWebsite({
      blocks: website.blocks.map((block) =>
        block.i === keyProp ? { ...block, url: uploadedUrl } : block
      )
    })
  }

  const blockContent = () => {
    switch (type) {
      case 'profile':
        return (
          <div className='flex flex-col items-center justify-center'>
            <Avatar className='w-48 h-48 mb-4'>
              <AvatarImage src={user.profile_picture} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className='text-2xl font-bold'>{user.name}</h2>
          </div>
        )
      case 'info':
        return (
          <div className='flex flex-col px-8'>
            <h1 className='text-4xl font-bold mb-2'>{website.title}</h1>
            <p className='text-gray-600'>{website.description}</p>
          </div>
        )
      case 'youtube':
        return (
          <div className='bg-red-600 text-white p-4 rounded-lg'>
            <h3 className='text-xl font-bold mb-2'>{title || 'YouTube'}</h3>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:underline'
            >
              {url}
            </a>
          </div>
        )
      case 'twitch':
        return (
          <div className='bg-purple-600 text-white p-4 rounded-lg'>
            <h3 className='text-xl font-bold mb-2'>{title || 'Twitch'}</h3>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:underline'
            >
              {url}
            </a>
          </div>
        )
      case 'github':
        return (
          <div className='bg-gray-800 text-white p-4 rounded-lg'>
            <h3 className='text-xl font-bold mb-2'>{title || 'GitHub'}</h3>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:underline'
            >
              {url}
            </a>
          </div>
        )
      case 'tiktok':
        return (
          <div className='bg-black text-white p-4 rounded-lg'>
            <h3 className='text-xl font-bold mb-2'>{title || 'TikTok'}</h3>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:underline'
            >
              {url}
            </a>
          </div>
        )
      case 'instagram':
        return (
          <div className='bg-pink-600 text-white p-4 rounded-lg'>
            <h3 className='text-xl font-bold mb-2'>{title || 'Instagram'}</h3>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white hover:underline'
            >
              {url}
            </a>
          </div>
        )
      case 'image':
        return (
          <div className='flex flex-col items-center justify-center'>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt='Uploaded'
                className='max-w-full max-h-full object-contain'
              />
            ) : (
              <ImageUpload onUploadComplete={handleImageUpload} />
            )}
          </div>
        )
      default:
        return <div>Block: {keyProp}</div>
    }
  }
  return <div className='relative'>{blockContent()}</div>
}
export default GridLayout
