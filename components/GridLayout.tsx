import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Block as BlockType, User, Website } from '@/types'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'

import { useMemo } from 'react'
import { useSite } from '@/contexts/SiteContext'

interface GridLayoutProps {
  keys: {
    i: string
    x: number
    y: number
    w: number
    h: number
    isResizable: boolean
  }[]
  user: User
  website: Website
  layout: {
    lg: BlockType[]
    xs: {
      w: number
      h: number
      i: string
      x: number
      y: number
      isResizable: boolean
    }[]
  }
}
interface BlockProps {
  keyProp: string
  user: User
  website: Website
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

  return (
    <div className='w-[900px] m-auto flex justify-between b-10 relative'>
      <ResponsiveReactGridLayout
        className='m-auto w-[900px]'
        breakpoints={{ xl: 1200, lg: 899, md: 768, sm: 480, xs: 200 }}
        cols={{ xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        rowHeight={300}
        layouts={layout}
        onDragStop={onLayoutChange}
      >
        {keys.map((key) => (
          <div
            key={key.i}
            className='bg-[#f5f5f7] border flex justify-center items-center shadow-[inset_0_0_0_2px_rgba(0,0,0,0)] rounded-2xl text-2xl text-[#1d1d1f] visible cursor-grab active:cursor-grabbing'
          >
            <Block keyProp={key.i} user={user} website={website} />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  )
}

export function Block({ keyProp, user, website }: BlockProps) {
  switch (keyProp) {
    case 'profile':
      return (
        <div className='flex flex-col  items-center justify-center'>
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
    default:
      return <div>Block: {keyProp}</div>
  }
}
export default GridLayout
