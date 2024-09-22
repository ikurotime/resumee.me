import React, { createContext, useContext, useState } from 'react'

import { Website } from '@/types'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateWebsite } from '@/actions/websites'

interface SiteContextType {
  website: Website | null
  isSaving: boolean
  saveWebsite: (updates: Partial<Website>) => Promise<void>
  deleteBlock: (blockId: string) => void
  saveBlockOrder: (
    newOrder: { i: string; x: number; y: number }[]
  ) => Promise<void>
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export const SiteProvider: React.FC<{
  children: React.ReactNode
  initialWebsite: Website
}> = ({ children, initialWebsite }) => {
  const [website, setWebsite] = useState<Website | null>(initialWebsite)

  const [isSaving, setIsSaving] = useState(false)
  const saveWebsite = async (updates: Partial<Website>) => {
    if (!website) return
    setIsSaving(true)
    try {
      if (!website.id) return
      const updatedWebsite = await updateWebsite(website.id, updates)
      setWebsite(updatedWebsite)
    } catch (error) {
      console.error('Error saving website:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const saveBlockOrder = async (
    newOrder: { i: string; x: number; y: number }[]
  ) => {
    if (!website) return
    setIsSaving(true)
    try {
      if (!website.id) return
      const updatedBlocks = website.blocks.map((block) => {
        const newPosition = newOrder.find((item) => item.i === block.i)
        return newPosition
          ? { ...block, x: newPosition.x, y: newPosition.y }
          : block
      })

      const updatedWebsite = await updateWebsite(website.id, {
        blocks: updatedBlocks
      })

      setWebsite(updatedWebsite)
    } catch (error) {
      console.error('Error saving block order:', error)
    } finally {
      setIsSaving(false)
    }
  }
  const deleteBlock = async (blockId: string) => {
    if (!website) return
    setIsSaving(true)
    try {
      if (!website.id) return
      const updatedBlocks = website.blocks.filter(
        (block) => block.i !== blockId
      )

      const updatedWebsite = await updateWebsite(website.id, {
        blocks: updatedBlocks
      })
      setWebsite(updatedWebsite)
    } catch (error) {
      console.error('Error deleting block:', error)
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <SiteContext.Provider
      value={{
        website,
        isSaving,
        saveWebsite,
        saveBlockOrder,
        deleteBlock
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider')
  }
  return context
}
