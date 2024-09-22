import React, { createContext, useCallback, useContext, useState } from 'react'

import { Website } from '@/types'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateWebsite } from '@/actions/websites'

interface SiteContextType {
  website: Website | null
  isSaving: boolean
  setWebsite: (website: Website) => void
  saveWebsite: (updates: Partial<Website>) => Promise<void>
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export const SiteProvider: React.FC<{
  children: React.ReactNode
  initialWebsite: Website
}> = ({ children, initialWebsite }) => {
  const [website, setWebsite] = useState<Website | null>(initialWebsite)

  const [isSaving, setIsSaving] = useState(false)

  const saveWebsite = useCallback(
    async (updates: Partial<Website>) => {
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
    },
    [website]
  )

  return (
    <SiteContext.Provider
      value={{
        website,
        isSaving,
        setWebsite,
        saveWebsite
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
