/* eslint-disable @typescript-eslint/no-explicit-any */
import { Block, Website } from '@/types'
import { updateBlock, updateWebsite } from '@/actions/websites'
import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'
import { uuid } from 'uuidv4'

const GRID_COLUMNS = 4

function calculateBlockPositions(blocks: Block[]) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order_index - b.order_index)
  const grid: (string | null)[][] = Array(GRID_COLUMNS)
    .fill(null)
    .map(() => Array(100).fill(null))

  return sortedBlocks.map((block) => {
    let x = 0,
      y = 0
    while (true) {
      if (canPlaceBlock(grid, x, y, block.width, block.height)) {
        placeBlock(grid, x, y, block.width, block.height, block.id)
        return { ...block, x, y }
      }
      x++
      if (x + block.width > GRID_COLUMNS) {
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

export function useWebsite(initialWebsite: Website | null) {
  const [website, setWebsite] = useState<Website | null>(initialWebsite)

  const debouncedUpdateBlock = useDebounce(async (blockId, updates) => {
    try {
      await updateBlock(blockId, updates)
      toast.success('Block updated successfully')
    } catch (error) {
      console.error('Error updating block:', error)
      toast.error('Failed to update block')
    }
  }, 500)

  const handleResizeBlock = (
    blockId: string,
    width: number,
    height: number
  ) => {
    if (!website) return

    const updatedBlocks = website.blocks.map((block) =>
      block.id === blockId ? { ...block, width, height } : block
    )

    const newPositions = calculateBlockPositions(updatedBlocks)

    setWebsite({
      ...website,
      blocks: newPositions
    })

    debouncedUpdateBlock(blockId, { width, height })
  }

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

  return {
    website,
    handleSave,
    handleAddBlock,
    handleDeleteBlock,
    moveCard,
    handleResizeBlock
  }
}
