import { Grip } from 'lucide-react'
import { useSite } from '@/contexts/SiteContext'

export const DeleteButton = ({ id }: { id: string }) => {
  const { deleteBlock } = useSite()

  return (
    <button
      onClick={() => deleteBlock(id)}
      className='bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
      </svg>
    </button>
  )
}

export const DeleteButtonWrapper = ({
  id,
  isOwnProfile
}: {
  id: string
  isOwnProfile: boolean
}) => {
  if (!isOwnProfile) return null
  return (
    <div className='absolute z-[9999] -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
      <DeleteButton id={id} />
    </div>
  )
}

export const DragHandle = ({
  id,
  isOwnProfile
}: {
  id: string
  isOwnProfile: boolean
}) => {
  if (!isOwnProfile) return null
  return (
    <div className='absolute draggable_handle z-[9999] -top-5 opacity-0 size-12 items-center flex justify-center group-hover:opacity-100 transition-opacity'>
      <div className='bg-white rounded-2xl size-8 z-[9999] relative justify-center flex items-center border'>
        <Grip id={id} size={16} />
      </div>
    </div>
  )
}
