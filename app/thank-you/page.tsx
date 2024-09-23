'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div className='min-h-screen bg-white relative'>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Thank You!</h1>
          <p className='text-lg'>Your submission has been received.</p>
          <div className='flex flex-col justify-center gap-4'>
            <Link
              href='/signup'
              className='bg-black hover:bg-gray-800 text-white text-xl font-bold h-14 rounded-md px-12 items-center flex'
            >
              Create Your Profile
            </Link>
            <Link
              href='/login'
              className='text-sm text-gray-600 hover:underline'
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
