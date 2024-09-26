import { useCallback, useState } from 'react'

import { checkWebsiteExists } from '@/actions/websites'
import { useDebounce } from '@/hooks/useDebounce'

export function useWebsiteCheck() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const checkWebsite = useCallback(async (pageName: string) => {
    if (!pageName) {
      setIsAvailable(false)
      setErrorMessage('')
      return
    }

    const result = await checkWebsiteExists(pageName)
    setIsAvailable(!result.exists)
    setErrorMessage(result.exists ? result.message || '' : '')
  }, [])

  const debouncedCheckWebsite = useDebounce(checkWebsite, 300)

  return { isAvailable, errorMessage, checkWebsite: debouncedCheckWebsite }
}
