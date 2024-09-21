'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  X
} from 'lucide-react'
import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateBlock } from '@/actions/websites'

interface DraggableCardProps {
  block: Block
  isEditable: boolean
  onDelete: (id: string) => void
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onResize: (width: number, height: number) => void
}

export function DraggableCard({
  block,
  isEditable,
  onDelete,
  index,
  moveCard,
  onResize
}: DraggableCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(block.content || {})
  const [isHovered, setIsHovered] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'card',
    hover(item: { id: string; index: number }) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const ref = React.useRef<HTMLDivElement>(null)
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

  const handleResize = (widthChange: number, heightChange: number) => {
    const newWidth = Math.max(1, Math.min(4, block.width + widthChange))
    const newHeight = Math.max(1, block.height + heightChange)
    onResize(newWidth, newHeight)
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
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        gridColumn: `span ${block.width}`,
        gridRow: `span ${block.height}`
      }}
      className='relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='h-full'>
        <CardContent className='p-4 h-full flex flex-col'>
          {renderContent()}
        </CardContent>
      </Card>
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
          <div className='absolute -bottom-2 -right-2 flex'>
            <Button
              variant='ghost'
              size='icon'
              className='bg-white rounded-full shadow-md mr-1'
              onClick={() => handleResize(0, -1)}
            >
              <ChevronUp className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='bg-white rounded-full shadow-md mr-1'
              onClick={() => handleResize(0, 1)}
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='bg-white rounded-full shadow-md mr-1'
              onClick={() => handleResize(-1, 0)}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='bg-white rounded-full shadow-md'
              onClick={() => handleResize(1, 0)}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
