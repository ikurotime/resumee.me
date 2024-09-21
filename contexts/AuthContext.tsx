'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User, WeakPassword } from '@supabase/supabase-js'

import { createWebsite } from '@/actions/websites'
import { supabase } from '@/lib/supabase-client'

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
  ) => Promise<{ user: User; session: Session; weakPassword?: WeakPassword }>
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
        setUser(session?.user ?? null)
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
    console.log('data', data)
    console.log('error', error)
    if (error) throw error
    if (data && data.user) {
      createWebsite(data.user.id, websiteName)
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
