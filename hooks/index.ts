import { useCallback, useEffect, useRef } from 'react'

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
