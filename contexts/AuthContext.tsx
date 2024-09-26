'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUserClient, signOutClient } from '@/utils/authClient'

import { User } from '@/types'
import { createClient } from '@/utils/supabase/client'

type AuthContextType = {
  user: User | null
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
      async (event, session) => {
        const currentUser = session?.user ? await getUserClient() : null
        setUser(currentUser as User | null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const contextValue = {
    user,
    signOut: async () => {
      await signOutClient()
      setUser(null)
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
