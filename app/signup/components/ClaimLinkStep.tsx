import { AnimatePresence, motion } from 'framer-motion'

import { FormState } from '@/types'
import Link from 'next/link'

interface ClaimLinkStepProps {
  formState: FormState
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleClaimLink: () => void
}

export function ClaimLinkStep({
  formState,
  handleInputChange,
  handleClaimLink
}: ClaimLinkStepProps) {
  return (
    <>
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
        {formState.isAvailable && formState.inputValue && (
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
    </>
  )
}
