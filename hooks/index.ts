import { Block, Website } from '@/types'
import { useCallback, useEffect, useRef } from 'react'

import { toast } from 'sonner'
import { updateWebsite } from '@/actions/websites'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      id: Date.now().toString(),
      content: {
        title: 'New block content'
      },
      website_id: website.id,
      block_type_id: '',
      x: 0,
      y: 0,
      width: 2,
      height: 1,
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

  const handleResizeBlock = (
    blockId: string,
    width: number,
    height: number
  ) => {
    if (!website) return

    setWebsite({
      ...website,
      blocks: website.blocks.map((block) =>
        block.id === blockId ? { ...block, width, height } : block
      )
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
