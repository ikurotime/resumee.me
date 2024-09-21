'use client'

import { useDrag } from 'react-dnd'

export default function DraggableBlock({
  block,
  onUpdate
}: {
  block: any
  onUpdate: any
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BLOCK',
    item: { id: block.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Render block content */}
    </div>
  )
}
