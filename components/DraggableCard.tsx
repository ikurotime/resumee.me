'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'

import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  onChangeSize
}: DraggableCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(block.content || {})
  const [localSize, setLocalSize] = useState({
    width: block.width,
    height: block.height
  })

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
      layout
      initial={false}
      animate={{
        gridColumn: `span ${localSize.width}`,
        gridRow: `span ${localSize.height}`,
        opacity: 1
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
    >
      <Card className='h-full'>
        <CardContent className='p-4 h-full flex flex-col'>
          {renderContent()}
        </CardContent>
      </Card>
      {isEditable && (
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
