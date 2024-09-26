'use client'

import { BlockProps, GridLayoutProps } from '@/types'
import { DeleteButtonWrapper, DragHandle } from './GridLayoutComponents'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import {
  containerVariants,
  handleCardSelect,
  itemVariants
} from './GridLayoutHelper'

import { motion } from 'framer-motion'
import { renderBlockContent } from './BlockContent'
import { useSite } from '@/contexts/SiteContext'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function GridLayout({ user, isOwnProfile }: GridLayoutProps) {
  const { saveBlockOrder, website } = useSite()
  const layout = {
    lg: website!.blocks,
    xs: website!.blocks
  }

  const onLayoutChange = (layout: Layout[]) => {
    const hasOrderChanged = layout.some((item, index) => {
      const originalBlock = website!.blocks[index]
      return (
        item.x !== originalBlock.x ||
        item.y !== originalBlock.y ||
        item.w !== originalBlock.w ||
        item.h !== originalBlock.h
      )
    })

    if (!hasOrderChanged) return

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
            className={`bg-[#fff] relative shadow-md flex justify-center items-center rounded-2xl text-2xl text-[#1d1d1f] visible ${
              isOwnProfile ? 'cursor-grab active:cursor-grabbing group' : ''
            }`}
          >
            <DeleteButtonWrapper id={block.i} isOwnProfile={isOwnProfile} />
            <DragHandle id={block.i} isOwnProfile={isOwnProfile} />
            <Block block={block} user={user} isOwnProfile={isOwnProfile} />
          </motion.div>
        ))}
      </ResponsiveReactGridLayout>
    </motion.div>
  )
}

function Block({ block, user, isOwnProfile = false }: BlockProps) {
  const { website, saveWebsite } = useSite()

  const handleSave = (field: string, value: string) => {
    const updatedBlocks = website!.blocks.map((b) =>
      b.i === block.i ? { ...b, [field]: value } : b
    )
    saveWebsite({ blocks: updatedBlocks })
  }

  return renderBlockContent(block, user, isOwnProfile, handleSave)
}

export default GridLayout
