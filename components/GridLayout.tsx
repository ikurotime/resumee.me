import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block as BlockType, User, Website } from '@/types'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'

import { SquareArrowOutUpRightIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSite } from '@/contexts/SiteContext'

interface BlockProps {
  block: BlockType
  user: User
  website: Website
}
interface GridLayoutProps {
  blocks: BlockType[]
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
function GridLayout({ blocks, user, website, layout }: GridLayoutProps) {
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
        {blocks.map((block) => (
          <motion.div
            key={block.i}
            variants={itemVariants}
            className='bg-[#fff]  relative shadow border flex justify-center items-center rounded-2xl text-2xl text-[#1d1d1f] visible cursor-grab active:cursor-grabbing group'
          >
            <div className='absolute z-[9999] -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
              <DeleteButton id={block.i} />
            </div>

            <Block block={block} user={user} website={website} />
          </motion.div>
        ))}
      </ResponsiveReactGridLayout>
    </motion.div>
  )
}

export function Block({ block, user, website }: BlockProps) {
  const socialCardStyles = {
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

  const blockContent = () => {
    const { type, title, url } = block
    const social = socialCardStyles[type]

    if (social) {
      return (
        <div
          className={`${social.bgColor} text-white p-4 rounded-lg flex h-full overflow-hidden w-full relative`}
        >
          <h3 className='text-xl font-bold mb-2'>{title || social.title}</h3>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-white rounded-full size-16 flex items-center justify-center bottom-5 left-5 absolute'
          >
            <SquareArrowOutUpRightIcon color='black' />
          </a>
        </div>
      )
    }

    // Handle other block types or default case
    switch (type) {
      // Add cases for other block types here
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
      default:
        return <div>Block: {block.i}</div>
    }
  }
  return blockContent()
}
export default GridLayout
