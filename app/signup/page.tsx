'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { pageTransition, pageVariants } from './animations'
import { useCallback, useEffect, useState } from 'react'

import { ClaimLinkStep } from './components/ClaimLinkStep'
import { CreateAccountStep } from './components/CreateAccountStep'
import { FormState } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useWebsiteCheck } from '@/hooks/useWebsiteCheck'
import { validateForm } from './utils/validation'

export default function ClaimLinkPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [formState, setFormState] = useState<FormState>({
    inputValue: '',
    showNextStep: false,
    showPassword: false,
    email: '',
    password: '',
    errorMessage: '',
    isAvailable: false
  })

  const { isAvailable, errorMessage, checkWebsite } = useWebsiteCheck()

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev: FormState) => ({ ...prev, ...updates }))
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      updateFormState({ inputValue: value })
      checkWebsite(value)
    },
    [updateFormState, checkWebsite]
  )

  // Update formState when isAvailable or errorMessage changes
  useEffect(() => {
    updateFormState({ isAvailable, errorMessage })
  }, [isAvailable, errorMessage, updateFormState])

  const handleClaimLink = useCallback(() => {
    if (isAvailable) {
      updateFormState({ showNextStep: true, errorMessage: '' })
    } else {
      updateFormState({
        errorMessage: 'This username is not available. Please choose another.'
      })
    }
  }, [isAvailable, updateFormState])

  const handleBack = useCallback(
    () => updateFormState({ showNextStep: false, errorMessage: '' }),
    [updateFormState]
  )

  const handleSignUp = useCallback(async () => {
    const validationResult = validateForm(formState)
    if (!validationResult.isValid) {
      updateFormState({ errorMessage: validationResult.errorMessage })
      return
    }

    try {
      await signUp(formState.email, formState.password, formState.inputValue)
      router.push(`/${formState.inputValue}`)
    } catch (error) {
      console.error(error)
      updateFormState({
        errorMessage: 'Failed to create account. Please try again.'
      })
    }
  }, [formState, signUp, router, updateFormState])

  const handleGoogleLogin = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?claim=${formState.inputValue}`
        }
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error during Google login:', error)
      updateFormState({
        errorMessage: 'Failed to sign in with Google. Please try again.'
      })
    }
  }, [supabase.auth, formState.inputValue, updateFormState])

  return (
    <div className='flex min-h-screen bg-white'>
      <div className='w-full md:w-1/2 flex items-center justify-center p-12'>
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
              <ClaimLinkStep
                formState={formState}
                handleInputChange={handleInputChange}
                handleClaimLink={handleClaimLink}
              />
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
              <CreateAccountStep
                formState={formState}
                updateFormState={updateFormState}
                handleBack={handleBack}
                handleSignUp={handleSignUp}
                handleGoogleLogin={handleGoogleLogin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='hidden md:flex w-1/2 bg-gray-100'>
        <video
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
