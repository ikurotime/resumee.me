import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <Image
          src='/icon.png'
          alt='Resumee.me Logo'
          width={100}
          height={100}
          priority
        />
      </motion.div>
    </div>
  )
}
