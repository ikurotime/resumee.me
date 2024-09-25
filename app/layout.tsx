import './globals.css'

import { AuthProvider } from '@/contexts/AuthContext'
import { CSPostHogProvider } from './providers'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Resumee - Your Career, One Link Away',
  description:
    'Create a stunning resume website and showcase your professional journey with a single link'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <CSPostHogProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>{children}</AuthProvider>
        </body>
      </CSPostHogProvider>
    </html>
  )
}
