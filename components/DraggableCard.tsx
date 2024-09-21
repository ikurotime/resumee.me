'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { EditableField } from '@/components/EditableField'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { updateBlock } from '@/actions/websites'
import { useDebounce } from '@/hooks'

interface DraggableCardProps {
  block: Block
  isEditable: boolean
  onDelete: (blockId: string) => void
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onChangeSize: (blockId: string, width: number, height: number) => void
}

export function DraggableCard({
  block,
  isEditable,
  onDelete,
  index,
  moveCard,
  onChangeSize
}: DraggableCardProps) {
  const [localSize, setLocalSize] = useState({
    width: block.width,
    height: block.height
  })
  const [isHovered, setIsHovered] = useState(false)

  const debouncedOnChangeSize = useDebounce((width, height) => {
    onChangeSize(block.id, width, height)
  }, 500)

  useEffect(() => {
    setLocalSize({ width: block.width, height: block.height })
  }, [block.width, block.height])

  const handleChangeSize = (width: number, height: number) => {
    setLocalSize({ width, height })
    debouncedOnChangeSize(width, height)
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: { id: string; index: number }) {
      if (item.index !== index) {
        moveCard(item.index, index)
        item.index = index
      }
    }
  })

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      layout
      initial={false}
      animate={{
        gridColumn: `span ${localSize.width}`,
        gridRow: `span ${localSize.height}`,
        opacity: isDragging ? 0.5 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 50,
        mass: 1
      }}
      className='relative aspect-square'
      style={{
        minHeight: `${localSize.height * 100}px`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='h-full'>
        <CardContent className='p-4 h-full flex flex-col'>
          <EditableField
            value={block.content?.title || ''}
            onSave={(value) =>
              updateBlock(block.id, { ...block.content, title: value })
            }
            isEditable={isEditable}
            className='text-xl font-bold'
            type='text'
          />
          <EditableField
            value={block.content?.description || ''}
            onSave={(value) =>
              updateBlock(block.id, { ...block.content, description: value })
            }
            isEditable={isEditable}
            className='text-gray-500 mt-2'
            type='textarea'
          />
        </CardContent>
      </Card>
      {isEditable && isHovered && (
        <>
          <Button
            variant='ghost'
            size='icon'
            className='absolute -top-2 -right-2 bg-white rounded-full shadow-md'
            onClick={() => onDelete(block.id)}
          >
            <X className='h-4 w-4' />
          </Button>
          <div className='absolute -bottom-2 -right-2'>
            <select
              className='bg-white rounded-full shadow-md p-1'
              value={`${localSize.width}x${localSize.height}`}
              onChange={(e) => {
                const [width, height] = e.target.value.split('x').map(Number)
                handleChangeSize(width, height)
              }}
            >
              <option value='1x1'>1x1</option>
              <option value='2x1'>2x1</option>
              <option value='1x2'>1x2</option>
              <option value='2x2'>2x2</option>
            </select>
          </div>
        </>
      )}
    </motion.div>
  )
}
