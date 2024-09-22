import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block as BlockType, User, Website } from '@/types'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSite } from '@/contexts/SiteContext'

interface BlockProps {
  keyProp: string
  user: User
  website: Website
  url?: string
  title?: string
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
        cols={{ xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        rowHeight={300}
        layouts={layout}
        onDragStop={onLayoutChange}
      >
        {keys.map((key) => (
          <motion.div
            key={key.i}
            variants={itemVariants}
            className='bg-[#fff] shadow border flex justify-center items-center  rounded-2xl text-2xl text-[#1d1d1f] visible cursor-grab active:cursor-grabbing'
          >
            <Block
              keyProp={key.i}
              user={user}
              website={website}
              url={key.url}
              title={key.title}
            />
          </motion.div>
        ))}
      </ResponsiveReactGridLayout>
    </motion.div>
  )
}

export function Block({ keyProp, user, website, url, title }: BlockProps) {
  switch (keyProp) {
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
        <div className='flex flex-col'>
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
    default:
      return <div>Block: {keyProp}</div>
  }
}
export default GridLayout
