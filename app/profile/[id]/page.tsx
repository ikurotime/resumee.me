import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase-server'

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

async function updateProfile(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const userId = formData.get('userId') as string

  const { error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/profile')
}

export default async function ProfilePage({
  params
}: {
  params: { id: string }
}) {
  const profile = await getProfile(params.id)

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <form action={updateProfile}>
        <input type='hidden' name='userId' value={profile.id} />
        <input type='text' name='name' defaultValue={profile.name} />
        <button type='submit'>Update Name</button>
      </form>
    </div>
  )
}
