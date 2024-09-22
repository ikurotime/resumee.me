import { AnimatePresence, motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Github, Lock, LogOut, Settings } from 'lucide-react'
import { User, Website } from '@/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TooltipComponent } from './TooltipComponent'
import { updateWebsiteSlug } from '@/actions/websites'
import { useState } from 'react'

function ExpandableMenuItem({
  icon,
  label,
  value,
  onSave,
  isUsername = false
}: {
  icon: React.ReactNode
  label: string
  value: string
  onSave: (value: string) => void
  isUsername?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  return (
    <DropdownMenuItem
      className='flex flex-col items-start p-0'
      onSelect={(e) => e.preventDefault()}
    >
      <motion.div
        className='flex w-full items-center p-2 cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        transition={{ duration: 0.2 }}
      >
        {icon}
        <div className='flex flex-col ml-4'>
          <span>{label}</span>
          <span className='text-gray-500 text-sm'>
            {isUsername ? `resumee.me/${value}` : value}
          </span>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className='w-full p-2 flex'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className='flex-grow mr-2 flex items-center bg-white border rounded-md'>
              {isUsername && (
                <span className='pl-3 text-gray-500'>resumee.me/</span>
              )}
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='flex-grow border-none focus:ring-0'
              />
            </div>
            <Button
              onClick={() => {
                onSave(inputValue)
                setIsExpanded(false)
              }}
              size='sm'
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownMenuItem>
  )
}

export function WebMenu({ website }: { user: User | null; website: Website }) {
  // Add save handlers for each field
  const handleSaveUsername = (newUsername: string) => {
    // Implement save logic for username

    updateWebsiteSlug(website?.id || '', newUsername)
    // Update the current window URL path
    if (typeof window !== 'undefined') {
      const url = window.location.href
      const newPath = url.replace(/\/[^\/]+$/, `/${newUsername}`)
      window.history.pushState({}, '', newPath)
    }
  }

  // const handleSaveEmail = (newEmail: string) => {
  //   // Implement save logic for email
  //   console.log('Saving email:', newEmail)
  // }

  const handleSavePassword = (newPassword: string) => {
    // Implement save logic for password
    console.log('Saving password:', newPassword)
  }

  return (
    <DropdownMenu>
      <TooltipComponent label='Settings'>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Settings className='h-6 w-6 ' />
          </Button>
        </DropdownMenuTrigger>
      </TooltipComponent>
      <DropdownMenuContent className='min-w-56'>
        <ExpandableMenuItem
          icon={<Github className='h-5 w-5' />}
          label='Username'
          value={`${website.page_slug}`}
          onSave={handleSaveUsername}
          isUsername={true}
        />
        {/* <ExpandableMenuItem
          icon={<Mail className='h-5 w-5' />}
          label='Email'
          value={user?.email || ''}
          onSave={handleSaveEmail}
        /> */}
        <ExpandableMenuItem
          icon={<Lock className='h-5 w-5' />}
          label='Password'
          value='••••••••'
          onSave={handleSavePassword}
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
