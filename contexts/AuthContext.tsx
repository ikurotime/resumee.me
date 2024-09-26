'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { signOut, signUp } from '@/utils/auth'

import { User } from '@/types'
import { createClient } from '@/utils/supabase/client'

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

  const contextValue = {
    user,
    signUp: async (email: string, password: string, websiteName: string) => {
      await signUp(email, password, websiteName)
    },
    signOut: async () => {
      await signOut()
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
