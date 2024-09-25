'use client'

import {} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { addInterestedEmail } from '@/actions/websites'
import { redirect } from 'next/navigation'

export default function Component() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const floatingAnimation = {
    y: ['0%', '5%', '0%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
  const handleEmailClick = (formData: FormData) => {
    const email = formData.get('email') as string
    addInterestedEmail(email)
    redirect('/thank-you')
  }
  function AnimatedSection({
    children,
    id
  }: {
    children: React.ReactNode
    id: string
  }) {
    const controls = useAnimation()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    useEffect(() => {
      if (isInView) {
        controls.start('visible')
      } else {
        controls.start('hidden')
      }
    }, [isInView, controls])

    return (
      <motion.section
        id={id}
        ref={ref}
        initial='hidden'
        animate={controls}
        variants={containerVariants}
        className='py-20 flex h-auto'
      >
        {children}
      </motion.section>
    )
  }

  return (
    <div className='min-h-screen bg-white relative'>
      {/* Render confetti when true */}
      <main className='space-y-20'>
        <AnimatedSection id='hero'>
          <div className='container mx-auto'>
            <motion.div className='text-center gap-4 flex flex-col items-center  min-h-[75vh] justify-center'>
              <motion.img
                src='/icon.png'
                className='mx-auto'
                alt='Resumee.me'
                width={100}
                height={100}
              />
              <motion.span className='text-xl text-black font-bold'>
                Resumee
              </motion.span>
              <span className='bg-black text-white px-4 py-1 rounded-full'>
                Beta
              </span>
              <motion.h1
                variants={itemVariants}
                className='text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
              >
                Your Career,
                <br /> One Link Away
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className='text-xl mb-8 text-gray-600 max-w-2xl mx-auto'
              >
                Showcase your skills, projects, and professional journey with a
                beautiful, interactive profile.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className='flex flex-col justify-center gap-4'
              >
                <Link
                  href='/signup'
                  className='bg-black hover:bg-gray-800 text-white text-xl font-bold h-14 rounded-md px-12 items-center flex'
                >
                  Create Your Profile
                </Link>
                <Link
                  href='/login'
                  className='text-sm text-gray-600 hover:underline'
                >
                  Log in
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className='mt-16 flex w-full '
              animate={floatingAnimation}
            >
              <Card className=' flex  mx-auto overflow-hidden shadow-lg  aspect-video'>
                <div className='bg-gradient-to-r from-blue-100 to-green-100 p-8 rounded-t-lg aspect-video  '>
                  <video
                    className='aspect-video'
                    src='/recording.mp4'
                    loop
                    muted
                    autoPlay
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection id='cta'>
          <div className='container mx-auto max-w-2xl'>
            <motion.div className='text-center'>
              <motion.h2
                variants={itemVariants}
                className='text-3xl font-bold mb-6 text-gray-900'
              >
                Ready to Showcase Your Tech Journey?
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className='text-xl mb-8 text-gray-600'
              >
                Let me know if you are interested in this project.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className='p-6'>
                    <form action={handleEmailClick} className='space-y-4'>
                      <Input
                        type='email'
                        name='email'
                        placeholder='Enter your email'
                        //value={email}
                        //  onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button className='w-full bg-black hover:bg-gray-800 text-white'>
                        Get Early Access
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
      <footer className='flex w-full border-t bg-white text-gray-600  sm:px-6 lg:px-8 mt-20'>
        <div className=' mx-auto'>
          <div className='mt-8 pt-8 border-gray-200 text-center'>
            <p>&copy; {new Date().getFullYear()} Resumee.me.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
