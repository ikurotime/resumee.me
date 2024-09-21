/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block, Website } from '@/types'
import { updateBlock, updateWebsite } from '@/actions/websites'
import { useCallback, useEffect, useRef } from 'react'

import { toast } from 'sonner'
import { useState } from 'react'
import { uuid } from 'uuidv4'

const GRID_COLUMNS = 4

function calculateBlockPositions(
  blocks: Block[],
  resizedBlockId: string,
  newWidth: number,
  newHeight: number
) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order_index - b.order_index)
  const grid: (string | null)[][] = Array(GRID_COLUMNS)
    .fill(null)
    .map(() => Array(100).fill(null))

  return sortedBlocks.map((block) => {
    const isResizedBlock = block.id === resizedBlockId
    const width = isResizedBlock ? newWidth : block.width
    const height = isResizedBlock ? newHeight : block.height

    // Find the first available position for the block
    let x = 0,
      y = 0
    while (true) {
      if (canPlaceBlock(grid, x, y, width, height)) {
        placeBlock(grid, x, y, width, height, block.id)
        return { ...block, x, y, width, height }
      }
      x++
      if (x + width > GRID_COLUMNS) {
        x = 0
        y++
      }
    }
  })
}

function canPlaceBlock(
  grid: (string | null)[][],
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (x + width > GRID_COLUMNS) return false
  for (let i = x; i < x + width; i++) {
    for (let j = y; j < y + height; j++) {
      if (grid[i][j] !== null) return false
    }
  }
  return true
}

function placeBlock(
  grid: (string | null)[][],
  x: number,
  y: number,
  width: number,
  height: number,
  id: string
) {
  for (let i = x; i < x + width; i++) {
    for (let j = y; j < y + height; j++) {
      grid[i][j] = id
    }
  }
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}

export const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    // make sure that textAreaRef exists
    if (textAreaRef) {
      // We need to reset the height first to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px'
      const { scrollHeight } = textAreaRef

      // Now we set the height directly
      textAreaRef.style.height = `${scrollHeight}px`
    }
  }, [textAreaRef, value])
}
export function useWebsite(initialWebsite: Website) {
  const [website, setWebsite] = useState<Website>(initialWebsite)
  console.log({ website })

  const handleSave = async (field: string, value: string) => {
    if (!website) return

    try {
      const updatedWebsite = await updateWebsite(website.id, { [field]: value })
      setWebsite(updatedWebsite)
      toast.success('Saved successfully')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save')
    }
  }

  const handleAddBlock = () => {
    if (!website) return

    const newBlock: Block = {
      width: 1,
      height: 1,
      id: uuid(),
      content: {
        title: 'New block content'
      },
      website_id: website.id,
      block_type_id: '',
      x: 0,
      y: 0,
      order_index: 0
    }

    setWebsite({
      ...website,
      blocks: [...website.blocks, newBlock]
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!website) return

    setWebsite({
      ...website,
      blocks: website.blocks.filter((block) => block.id !== blockId)
    })
  }

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    if (!website) return

    const dragCard = website.blocks[dragIndex]
    const updatedBlocks = [...website.blocks]
    updatedBlocks.splice(dragIndex, 1)
    updatedBlocks.splice(hoverIndex, 0, dragCard)

    setWebsite({
      ...website,
      blocks: updatedBlocks
    })
  }

  const handleResizeBlock = async (
    blockId: string,
    width: number,
    height: number
  ) => {
    if (!website) return

    // Optimistic update
    const optimisticBlocks = website.blocks.map((block) =>
      block.id === blockId ? { ...block, width, height } : block
    )

    setWebsite({
      ...website,
      blocks: optimisticBlocks
    })

    try {
      const updatedBlocks = calculateBlockPositions(
        optimisticBlocks,
        blockId,
        width,
        height
      )

      // Update the resized block in the database
      await updateBlock(blockId, { width, height })

      // Update all blocks with their new positions
      for (const block of updatedBlocks) {
        await updateBlock(block.id, {
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height
        })
      }

      setWebsite({
        ...website,
        blocks: updatedBlocks
      })

      toast.success('Block resized successfully')
    } catch (error) {
      console.error('Error resizing block:', error)
      toast.error('Failed to resize block')
      // Revert to the original state if there's an error
      setWebsite({
        ...website,
        blocks: website.blocks
      })
    }
  }

  return {
    website,
    handleSave,
    handleAddBlock,
    handleDeleteBlock,
    moveCard,
    handleResizeBlock
  }
}
