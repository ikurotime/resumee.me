'use client'

import { Card, CardContent } from '@/components/ui/card'

import { Block } from '@/types'
import { motion } from 'framer-motion'
import { useDrag } from 'react-dnd'

export function DraggableCard({ block }: { block: Block }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    startLine: 1,
    endLine: 45,
    type: 'card',
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card>
        <CardContent className='p-4'>
          {/* Render block content here */}
          <p>{JSON.stringify(block.content)}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
