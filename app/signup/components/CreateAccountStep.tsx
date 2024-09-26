import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { FormState } from '@/types'
import { Input } from '@/components/ui/input'

interface CreateAccountStepProps {
  formState: FormState
  updateFormState: (updates: Partial<FormState>) => void
  handleBack: () => void
  handleSignUp: () => void
  handleGoogleLogin: () => void
}

export function CreateAccountStep({
  formState,
  updateFormState,
  handleBack,
  handleSignUp,
  handleGoogleLogin
}: CreateAccountStepProps) {
  return (
    <div className='space-y-6'>
      <Button variant='ghost' onClick={handleBack}>
        &larr; Back
      </Button>
      <div className='space-y-2'>
        <p className='text-lg'>resumee.me/{formState.inputValue} is yours!</p>
        <h2 className='text-2xl font-bold'>Now, create your account</h2>
      </div>
      <div className='space-y-4'>
        <Input
          type='email'
          placeholder='Email'
          value={formState.email}
          onChange={(e) => updateFormState({ email: e.target.value })}
        />
        <div className='relative'>
          <Input
            type={formState.showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={formState.password}
            onChange={(e) => updateFormState({ password: e.target.value })}
          />
          <Button
            variant='ghost'
            className='absolute right-2 top-1/2 transform -translate-y-1/2'
            onClick={() =>
              updateFormState({ showPassword: !formState.showPassword })
            }
          >
            {formState.showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      <AnimatePresence mode='wait'>
        {formState.email || formState.password ? (
          <motion.div
            key='create-account'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              className='w-full'
              onClick={handleSignUp}
              disabled={!formState.email || !formState.password}
            >
              Create account
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key='google-signup'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant='outline'
              className='w-full'
              onClick={handleGoogleLogin}
            >
              Sign up with Google
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
