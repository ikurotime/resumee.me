import { useCallback, useState } from 'react'

import { User } from '@/types'
import { createClient } from '@/utils/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  const signUp = useCallback(
    async (email: string, password: string, websiteName: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.user) {
        setUser(data.user as User)
        // Here you would typically create the website for the user
        // This is just a placeholder and should be implemented according to your needs
        console.log(`Creating website ${websiteName} for user ${data.user.id}`)
      }
    },
    [supabase.auth]
  )

  return { user, signUp }
}
