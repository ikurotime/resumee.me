import { FloatingBottomBar } from '@/components/FloatingBottomBar'
import GridLayout from './GridLayout'
import { User } from '@/types'
import { useSite } from '@/contexts/SiteContext'

export function CVBuilder({
  user,
  isOwnProfile
}: {
  user: User
  isOwnProfile: boolean
}) {
  const { bgColor } = useSite()
  return (
    <div
      className={`flex flex-1 flex-col md:flex-row h-screen  overflow-y-scroll`}
      style={{ backgroundColor: bgColor }}
    >
      <GridLayout user={user} isOwnProfile={isOwnProfile} />
      {isOwnProfile && <FloatingBottomBar user={user} />}
    </div>
  )
}

export default CVBuilder
