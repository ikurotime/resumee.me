'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'

import { Block } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { updateBlock } from '@/actions/websites'
import { useDrag } from 'react-dnd'

interface DraggableCardProps {
  block: Block
  isEditable: boolean
}

export function DraggableCard({ block, isEditable }: DraggableCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(block.content || {})

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await updateBlock(block.id, editedContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update block:', error)
      // Handle error (e.g., show an error message to the user)
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
      ref={drag}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card>
        <CardContent className='p-4'>{renderContent()}</CardContent>
      </Card>
    </motion.div>
  )
}
