import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ExpandableInputProps {
  title: string
  description: string
  buttonText: string
  onSubmit: (value: string) => void
  isVisible: boolean
}

export const ExpandableInput: React.FC<ExpandableInputProps> = ({
  title,
  description,
  buttonText,
  onSubmit,
  isVisible
}) => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setInputValue('')
    }
  }, [isVisible])

  const handleSubmit = () => {
    onSubmit(inputValue)
    setInputValue('')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className='bg-white rounded-lg shadow-lg p-6 max-w-md'
        >
          <h2 className='text-2xl font-bold mb-2'>{title}</h2>
          <p className='text-gray-600 mb-4'>{description}</p>
          <Input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className='mb-4'
            placeholder='Enter your text here'
          />
          <Button
            onClick={handleSubmit}
            className='w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300'
          >
            {buttonText}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
