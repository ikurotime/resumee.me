'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, WeakPassword } from '@supabase/supabase-js'

import { User } from '@/types'
import { createWebsite } from '@/actions/websites'
import { supabase } from '@/lib/supabase-client'
import { v4 } from 'uuid'

type AuthContextType = {
  user: User | null
  signUp: (
    email: string,
    password: string,
    websiteName: string
  ) => Promise<void>
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    user: User
    session: Session
    weakPassword?: WeakPassword | undefined
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
            title: ''
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
            imageUrl: ''
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
            imageUrl: ''
          }
        ]
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
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
