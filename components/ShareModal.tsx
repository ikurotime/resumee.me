'use client'

import { Button } from '@/components/ui/button'
import { TwitterLogoIcon } from '@radix-ui/react-icons'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  pageLink: string
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  pageLink
}) => {
  const tweetContent = `Just made my new page. I can't wait to customize it! I'm going to have a cool link-in-bio ${pageLink}`

  const handleTweet = () => {
    const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(
      tweetContent
    )}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 flex items-center justify-center  ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className='bg-white rounded-2xl p-6 shadow-lg max-w-sm h-96 relative'
      >
        <div className='border p-4 bg-white rounded-2xl h-full justify-between flex flex-col'>
          <h2 className='text-lg font-bold mb-4'>Share this page</h2>
          <p className='mb-4'>{tweetContent}</p>

          <div className='flex justify-end'>
            <Button
              onClick={handleTweet}
              size={'3xl'}
              className='rounded-full w-full text-xl font-bold mr-2 bg-blue-400 hover:bg-blue-5 gap-4'
            >
              <TwitterLogoIcon className='size-8' /> Tweet
            </Button>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant={'ghost'}
          size={'icon'}
          className='rounded-full  text-xl font-bold aspect-square absolute top-0 right-0'
        >
          <X className='size-4' />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default ShareModal
