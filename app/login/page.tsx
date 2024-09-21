'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      setError('Failed to log in. Please check your credentials.')
    }
  }

  return (
    <div className='flex min-h-screen bg-white'>
      <div className='w-1/2 flex items-center justify-center p-12'>
        <div className='w-full max-w-md'>
          <h1 className='text-3xl font-bold mb-6 text-black'>
            Log in to your account
          </h1>
          <form onSubmit={handleLogin}>
            <div className='mb-4'>
              <input
                type='email'
                placeholder='Email'
                className='w-full p-2 border rounded-md text-black placeholder-gray-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <input
                type='password'
                placeholder='Password'
                className='w-full p-2 border rounded-md text-black placeholder-gray-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className='text-red-500 mb-4'>{error}</p>}
            <button
              type='submit'
              className='w-full py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors'
            >
              Log in
            </button>
          </form>
          <Link
            href='/signup'
            className='block mt-4 text-sm text-gray-500 hover:underline'
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
      <div className='w-1/2 bg-gray-100'>
        {/* Right side content or image placeholder */}
      </div>
    </div>
  )
}
