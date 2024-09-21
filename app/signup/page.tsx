'use client'

import { AnimatePresence, motion } from 'framer-motion'

import Link from 'next/link'
import { useState } from 'react'

export default function ClaimLinkPage() {
  const [inputValue, setInputValue] = useState('')
  const [showNextStep, setShowNextStep] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClaimLink = () => {
    setShowNextStep(true)
  }

  const handleBack = () => {
    setShowNextStep(false)
  }

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 20 : -20
    }),
    in: {
      opacity: 1,
      x: 0
    },
    out: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 20 : -20
    })
  }

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  }

  return (
    <div className='flex min-h-screen bg-white'>
      <div className='w-1/2 flex items-center justify-center p-12'>
        <AnimatePresence custom={showNextStep ? 1 : -1} mode='wait'>
          {!showNextStep ? (
            <motion.div
              key='step1'
              custom={-1}
              initial='initial'
              animate='in'
              exit='out'
              variants={pageVariants}
              transition={pageTransition}
              className='w-full max-w-md'
            >
              <h1 className='text-3xl font-bold mb-6 text-black'>
                Let&apos;s claim your unique link
              </h1>
              <div className='relative'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500'>
                  resumee.me/
                </span>
                <input
                  type='text'
                  placeholder='your-name'
                  className='w-full pl-28 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className='h-14 mt-4'>
                <AnimatePresence>
                  {inputValue && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        mass: 1
                      }}
                      className='w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors'
                      onClick={handleClaimLink}
                    >
                      Claim your link
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href='/login'
                className='block mt-4 text-sm text-gray-500 hover:underline'
              >
                or log in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key='step2'
              custom={1}
              initial='initial'
              animate='in'
              exit='out'
              variants={pageVariants}
              transition={pageTransition}
              className='w-full max-w-md'
            >
              <button className='mb-4 text-black' onClick={handleBack}>
                &larr; Back
              </button>
              <p className='text-lg text-black mb-2'>
                resumee.me/{inputValue} is yours!
              </p>
              <h2 className='text-2xl font-bold mb-6 text-black'>
                Now, create your account
              </h2>
              <div className='flex space-x-4 mb-4'>
                <input
                  type='email'
                  placeholder='Email'
                  className='flex-1 p-2 border rounded-md text-black placeholder-gray-500'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className='flex-1 relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    className='w-full p-2 border rounded-md pr-10 text-black placeholder-gray-500'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <AnimatePresence mode='wait'>
                {email || password ? (
                  <motion.button
                    key='create-account'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors'
                  >
                    Create account
                  </motion.button>
                ) : (
                  <motion.button
                    key='google-signup'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='w-full py-2 bg-white text-black border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                  >
                    Sign up with Google
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='w-1/2 bg-gray-100'>
        {/* Right side content or image placeholder */}
      </div>
    </div>
  )
}
