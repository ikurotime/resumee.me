import { useCallback, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Website } from '@/types'
import { toast } from 'sonner'
import { updateWebsite } from '@/actions/websites'

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

export function useWebsite(initialWebsite: Website | null) {
  const [website, setWebsite] = useState<Website | null>(initialWebsite)

  const handleSave = async (field: string, value: string) => {
    if (!website) return

    try {
      if (!website.id) return
      const updatedWebsite = await updateWebsite(website.id, { [field]: value })
      setWebsite(updatedWebsite)
      toast.success('Saved successfully')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save')
    }
  }

  return {
    website,
    handleSave
  }
}
