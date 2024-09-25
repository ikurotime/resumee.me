'use client'

import {} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { addInterestedEmail } from '@/actions/websites'
import { createClient } from '@/utils/supabase/client'
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

  // const floatingAnimation = {
  //   y: ['0%', '5%', '0%'],
  //   transition: {
  //     duration: 5,
  //     repeat: Infinity,
  //     ease: 'easeInOut'
  //   }
  // }
  const supabase = createClient()
  const [userPictures, setUserPictures] = useState<string[]>([])

  useEffect(() => {
    const fetchUserPictures = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('profile_picture')
        .not('profile_picture', 'is', null)
        .limit(20)

      if (error) {
        console.error('Error fetching user pictures:', error)
        return
      }

      const pictures = data.map((user) => user.profile_picture)
      setUserPictures(pictures)
    }

    fetchUserPictures()
  }, [])
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
                  Create Your Resumee
                </Link>
                <Link
                  href='/login'
                  className='text-sm text-gray-600 hover:underline'
                >
                  Log in
                </Link>
              </motion.div>
            </motion.div>
            <motion.div className='mt-16 flex w-full '>
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
        <AnimatedSection id='users'>
          <div className='container mx-auto max-w-6xl'>
            <motion.div variants={itemVariants} className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900'>
                Join Our Growing Community
              </h2>
              <p className='text-xl text-gray-600 mt-4'>
                See who&apos;s already creating their professional story with
                Resumee
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className='flex flex-wrap justify-center gap-6'
            >
              {userPictures.map((picture, index) => (
                <Avatar
                  key={index}
                  className='w-14 h-14 md:w-20 md:h-20 pointer-events-none'
                >
                  <AvatarImage
                    src={picture}
                    className='select-none'
                    alt={`User ${index + 1}`}
                  />
                  <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                </Avatar>
              ))}
              <Link
                href='/signup'
                className='bg-black mt-20 hover:bg-gray-800 text-white text-xl font-bold h-14 rounded-md px-12 items-center flex'
              >
                Create Your Resumee
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection id='cta-features'>
          <div className='container mx-auto max-w-6xl py-20'>
            <motion.div
              variants={itemVariants}
              className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
            >
              <div className='space-y-8'>
                <FeatureItem>Your Career</FeatureItem>
                <FeatureItem>Showcase Projects</FeatureItem>
              </div>
              <div className='space-y-8'>
                <FeatureItem>Share Achievements</FeatureItem>
                <FeatureItem>Connect Globally</FeatureItem>
              </div>
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
      <footer className='flex w-full border-t min-h-screen bg-white text-gray-600  sm:px-6 lg:px-8 mt-20'>
        <div className=' mx-auto'>
          <div className='mt-8 pt-8 border-gray-200 text-center'>
            <p> made by Kuro. for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
// Update the FeatureItem component
function FeatureItem({ children }: { children: React.ReactNode }) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, width: '100%' })
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      className='text-center'
    >
      <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
        {children}
      </h2>
      <motion.div
        initial={{ width: '0%' }}
        animate={controls}
        transition={{
          duration: 1,
          ease: 'easeInOut'
        }}
        className='h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto'
      />
    </motion.div>
  )
}
