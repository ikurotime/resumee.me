'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import { User } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { createWebsite } from '@/actions/websites'
import { v4 } from 'uuid'

type AuthContextType = {
  user: User | null
  signUp: (
    email: string,
    password: string,
    websiteName: string
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const supabase = createClient()
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user as unknown as User | null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (
    email: string,
    password: string,
    websiteName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) throw error
    if (data && data.user) {
      createWebsite({
        user_id: data.user.id,
        page_name: websiteName,
        blocks: [
          {
            i: v4(),
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            isResizable: false,
            url: '',
            type: 'profile',
            imageUrl: '',
            content: '',
            title: '',
            fullSizedImage: false
          },
          {
            i: v4(),
            x: 1,
            y: 0,
            w: 2,
            h: 1,
            isResizable: false,
            url: '',
            type: 'info',
            title: '',
            content: '',
            imageUrl: '',
            fullSizedImage: false
          },
          {
            i: v4(),
            x: 2,
            y: 0,
            w: 2,
            h: 1,
            isResizable: false,
            url: '',
            type: 'info',
            title: 'Welcome to your page!',
            content: 'Use the buttons below to add some cards.',
            imageUrl: '',
            fullSizedImage: false
          }
        ]
      })
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  return (
    <AuthContext.Provider value={{ user, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
