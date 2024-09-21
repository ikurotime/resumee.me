'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { updateBlock } from '@/actions/websites'

interface DraggableCardProps {
  block: Block
  isEditable: boolean
  onDelete: (id: string) => void
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
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(block.content || {})
  const [isHovered, setIsHovered] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { id: block.id, index, width: block.width, height: block.height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'card',
    hover(
      item: { id: string; index: number; width: number; height: number },
      monitor
    ) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateBlock(block.id, editedContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update block:', error)
    }
  }

  const handleCancel = () => {
    setEditedContent(block.content || {})
    setIsEditing(false)
  }

  const handleChangeSize = (width: number, height: number) => {
    onChangeSize(block.id, width, height)
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className='space-y-2'>
          <Input
            value={editedContent.title || ''}
            onChange={(e) =>
              setEditedContent({ ...editedContent, title: e.target.value })
            }
            placeholder='Title'
          />
          <textarea
            value={editedContent.description || ''}
            onChange={(e) =>
              setEditedContent({
                ...editedContent,
                description: e.target.value
              })
            }
            placeholder='Description'
            className='w-full p-2 border rounded'
          />
          <div className='flex justify-end space-x-2'>
            <Button onClick={handleSave}>Save</Button>
            <Button variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    return (
      <>
        <h3 className='font-bold'>{block.content?.title || 'Untitled'}</h3>
        <p>{block.content?.description || 'No description'}</p>
        {isEditable && (
          <Button onClick={handleEdit} className='mt-2'>
            Edit
          </Button>
        )}
      </>
    )
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={false}
      animate={{
        gridColumn: `span ${block.width}`,
        gridRow: `span ${block.height}`,
        opacity: isDragging ? 0.5 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 50,
        mass: 1
      }}
      className='relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: '100%',
        minHeight: `${block.height * 100}px`
      }}
    >
      <AnimatePresence>
        <motion.div
          key={`${block.width}-${block.height}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className='h-full'
        >
          <Card className='h-full'>
            <CardContent className='p-4 h-full flex flex-col'>
              {renderContent()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      {isHovered && isEditable && (
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
              value={`${block.width}x${block.height}`}
              onChange={(e) => {
                const [width, height] = e.target.value.split('x').map(Number)
                console.log({ width, height })
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
