'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'

import Link from 'next/link'
import { checkWebsiteExists } from '@/actions/websites'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useDebounce } from '@/hooks'
import { useRouter } from 'next/navigation'

export default function ClaimLinkPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [formState, setFormState] = useState({
    inputValue: '',
    showNextStep: false,
    showPassword: false,
    email: '',
    password: '',
    errorMessage: '',
    isAvailable: false
  })
  const supabase = createClient()
  const handleGoogleLogin = () => {
    const isLocalEnv = process.env.NODE_ENV === 'development'

    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: isLocalEnv
          ? `http://localhost:3000/auth/callback?claim=${formState.inputValue}`
          : `https://resumee.me/auth/callback?claim=${formState.inputValue}`
      }
    })
  }

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
  }

  const handleWebsiteCheck = useCallback(async (pageName: string) => {
    if (!pageName) {
      updateFormState({ isAvailable: false, errorMessage: '' })
      return
    }
    const regex = /^[a-z0-9-]{1,20}$/
    if (!regex.test(pageName)){
        updateFormState({
            isAvailable: false,
            errorMessage: 'Name can\'t have symbols and must be between 1 and 20 characters.'
        })
        return
    }

    const result = await checkWebsiteExists(pageName)
    updateFormState({
      isAvailable: !result.exists,
      errorMessage: result.exists ? result.message || '' : ''
    })
  }, [])

  const debouncedWebsiteCheck = useDebounce(handleWebsiteCheck, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateFormState({ inputValue: value })
    debouncedWebsiteCheck(value)
  }

  const handleClaimLink = () => {
    updateFormState({ showNextStep: true })
  }

  const handleBack = () => {
    updateFormState({ showNextStep: false })
  }

  const handleSignUp = async () => {
    try {
      await signUp(formState.email, formState.password, formState.inputValue)
      // Redirect to the dashboard or profile page after successful signup
      router.push(`/${formState.inputValue}`)
    } catch (error) {
      console.error(error)
      updateFormState({
        errorMessage: 'Failed to create account. Please try again.'
      })
    }
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
        <AnimatePresence custom={formState.showNextStep ? 1 : -1} mode='wait'>
          {!formState.showNextStep ? (
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
                  className='w-full pl-28 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                  value={formState.inputValue}
                  onChange={handleInputChange}
                />
                {formState.isAvailable && (
                  <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-green-500'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div className='h-14 mt-4'>
                <AnimatePresence>
                  {formState.errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='text-red-500 text-sm mb-1'
                    >
                      {formState.errorMessage}
                    </motion.p>
                  )}
                  {formState.inputValue && (
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
                      className={`w-full py-2 text-white rounded-md transition-colors ${
                        formState.isAvailable
                          ? 'bg-zinc-900 hover:bg-zinc-800'
                          : 'bg-zinc-400 cursor-not-allowed'
                      }`}
                      onClick={handleClaimLink}
                      disabled={!formState.isAvailable}
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
                resumee.me/{formState.inputValue} is yours!
              </p>
              <h2 className='text-2xl font-bold mb-6 text-black'>
                Now, create your account
              </h2>
              <div className='flex space-x-4 mb-4'>
                <input
                  type='email'
                  placeholder='Email'
                  className='flex-1 p-2 border rounded-md text-black placeholder-gray-500'
                  value={formState.email}
                  onChange={(e) => updateFormState({ email: e.target.value })}
                />
                <div className='flex-1 relative'>
                  <input
                    type={formState.showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    className='w-full p-2 border rounded-md pr-10 text-black placeholder-gray-500'
                    value={formState.password}
                    onChange={(e) =>
                      updateFormState({ password: e.target.value })
                    }
                  />
                  <button
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                    onClick={() =>
                      updateFormState({ showPassword: !formState.showPassword })
                    }
                  >
                    {formState.showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <AnimatePresence mode='wait'>
                {formState.email || formState.password ? (
                  <motion.button
                    key='create-account'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className='w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors'
                    onClick={handleSignUp}
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
                    onClick={handleGoogleLogin}
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
        <video
          width='1200'
          height='720'
          className='h-full object-cover'
          src='/recording.mp4'
          loop
          muted
          autoPlay
        />
      </div>
    </div>
  )
}
