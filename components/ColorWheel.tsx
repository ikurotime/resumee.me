'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

import { BlockPicker } from 'react-color'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'
import { useSite } from '@/contexts/SiteContext'

type ColorWheelProps = {
  isPickerVisible: boolean
  onColorPick: () => void
}
const ColorWheel = ({ isPickerVisible, onColorPick }: ColorWheelProps) => {
  const { website, saveWebsite, setBgColor } = useSite()
  const [color, setColor] = useState(website?.page_content || '#ffffff') // Default to white
  let timeout: NodeJS.Timeout

  const handleChangeComplete = (color: { hex: string }) => {
    setColor(color.hex)
    setBgColor(color.hex)
    // Clear the previous timeout
    if (timeout) clearTimeout(timeout)
    // Set a new timeout to save the color after user stops selecting
    timeout = setTimeout(() => {
      const updatedWebsite = { ...website, page_content: color.hex }
      saveWebsite(updatedWebsite)
    }, 500) // Adjust the delay as needed
  }

  const togglePicker = () => {
    onColorPick()
  }

  return (
    <div className='flex flex-col items-center relative'>
      <AnimatePresence>
        {isPickerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 10,
              duration: 100
            }}
            className='absolute bottom-14'
          >
            <BlockPicker
              color={color}
              onChangeComplete={handleChangeComplete}
              triangle='hide'
              onChange={(color) => setColor(color.hex)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onClick={togglePicker}
        size={'icon'}
        variant={'ghost'}
        className='size-10'
      >
        <Palette className='h-6 w-6' />
      </Button>
    </div>
  )
}

export default ColorWheel
