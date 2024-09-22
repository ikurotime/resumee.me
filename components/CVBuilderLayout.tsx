import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import GridLayout from './GridLayout'
import { User } from '@/types'

export function CVBuilder({
  user,
  isOwnProfile
}: {
  user: User
  isOwnProfile: boolean
}) {
  return (
    <div className='flex flex-1 flex-col md:flex-row h-screen  overflow-y-scroll'>
      <GridLayout user={user} />
      {isOwnProfile && <FloatingBottomBar user={user} />}
    </div>
  )
}

export default CVBuilder
