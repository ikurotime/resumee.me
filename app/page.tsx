'use client'

import {
  BarChart2,
  Code,
  Github,
  Link as LinkIcon,
  Linkedin,
  Share2,
  Twitter
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

export default function Component() {
  const [email, setEmail] = useState('')

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
        className='py-20'
      >
        {children}
      </motion.section>
    )
  }

  return (
    <div className='min-h-screen bg-white overflow-hidden'>
      <main className='space-y-20 '>
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
              <motion.span className='text-xl text-black font-bold'></motion.span>
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
            <motion.div className='mt-16' animate={floatingAnimation}>
              <Card className='w-full max-w-4xl mx-auto overflow-hidden shadow-lg'>
                <CardContent className='p-0'>
                  <div className='bg-gradient-to-r from-blue-100 to-green-100 p-8 rounded-t-lg'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='col-span-2 flex items-center'>
                        <Image
                          src='https://avatars.githubusercontent.com/u/77805983?v=4'
                          alt='ikurotime'
                          width={80}
                          height={80}
                          className='rounded-full mr-4'
                        />
                        <div>
                          <h2 className='text-2xl font-bold mb-2'>ikurotime</h2>
                          <p className='text-gray-600'>
                            Software Engineer | Open Source Contributor
                          </p>
                        </div>
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <Github className='w-6 h-6 text-gray-700' />
                        <Linkedin className='w-6 h-6 text-gray-700' />
                        <Twitter className='w-6 h-6 text-gray-700' />
                      </div>
                    </div>
                  </div>
                  <div className='p-8'>
                    <h3 className='text-lg font-semibold mb-4'>Tech Stack</h3>
                    <div className='flex flex-wrap gap-2'>
                      {[
                        'React',
                        'Node.js',
                        'TypeScript',
                        'GraphQL',
                        'Docker'
                      ].map((tech) => (
                        <span
                          key={tech}
                          className='px-3 py-1 bg-yellow-100 rounded-full text-sm text-yellow-800'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection id='features'>
          <div className='container mx-auto'>
            <motion.h2
              variants={itemVariants}
              className='text-3xl font-bold mb-12 text-center text-gray-900'
            >
              Features that Set You Apart
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[
                {
                  icon: LinkIcon,
                  title: 'One Link for All',
                  description:
                    'Share your entire professional profile with a single, customizable link.'
                },
                {
                  icon: Code,
                  title: 'Showcase Your Tech Stack',
                  description:
                    'Highlight your skills and technologies with an interactive display.'
                },
                {
                  icon: Github,
                  title: 'GitHub Integration',
                  description:
                    'Automatically import your repositories and display your contribution graph.'
                },
                {
                  icon: Share2,
                  title: 'Easy Sharing',
                  description:
                    'Share your profile across platforms with just one click.'
                },
                {
                  icon: BarChart2,
                  title: 'Project Insights',
                  description:
                    'Showcase your side projects and startups with detailed analytics and graphs.'
                },
                {
                  icon: Linkedin,
                  title: 'Social Media Integration',
                  description:
                    'Connect all your professional social media profiles in one place.'
                }
              ].map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className='h-full'>
                    <CardContent className='p-6 flex flex-col h-full'>
                      <feature.icon className='w-12 h-12 mb-4 text-gray-400' />
                      <h3 className='text-xl font-semibold mb-2'>
                        {feature.title}
                      </h3>
                      <p className='text-gray-600 flex-grow'>
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id='how-it-works'>
          <div className='container mx-auto'>
            <motion.h2
              variants={itemVariants}
              className='text-3xl font-bold mb-12 text-center text-gray-900'
            >
              How It Works
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  step: 1,
                  title: 'Create Your Profile',
                  description: 'Sign up and fill in your basic information.'
                },
                {
                  step: 2,
                  title: 'Connect Your Accounts',
                  description:
                    'Link your GitHub, LinkedIn, and other professional accounts.'
                },
                {
                  step: 3,
                  title: 'Share Your Link',
                  description:
                    'Get your unique Resumee.me link and share it with the world.'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className='text-center'
                >
                  <div className='w-16 h-16 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                    {step.step}
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
                  <p className='text-gray-600'>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id='pricing'>
          <div className='container mx-auto'>
            <motion.h2
              variants={itemVariants}
              className='text-3xl font-bold mb-12 text-center text-gray-900'
            >
              Simple, Transparent Pricing
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              {[
                {
                  name: 'Basic',
                  price: 'Free',
                  features: [
                    'One customizable link',
                    'Basic analytics',
                    'GitHub integration'
                  ]
                },
                {
                  name: 'Pro',
                  price: '$9/month',
                  features: [
                    'Multiple customizable links',
                    'Advanced analytics',
                    'Priority support',
                    'Remove Resumee.me branding'
                  ]
                },
                {
                  name: 'Team',
                  price: 'Contact Us',
                  features: [
                    'Everything in Pro',
                    'Team management',
                    'API access',
                    'Custom domain'
                  ]
                }
              ].map((plan, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className='h-full'>
                    <CardContent className='p-6 flex flex-col h-full'>
                      <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                      <p className='text-3xl font-semibold mb-4'>
                        {plan.price}
                      </p>
                      <ul className='space-y-2 mb-6 flex-grow'>
                        {plan.features.map((feature, i) => (
                          <li key={i} className='flex items-center'>
                            <svg
                              className='w-4 h-4 mr-2 text-green-500'
                              fill='none'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path d='M5 13l4 4L19 7'></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className='w-full bg-black hover:bg-gray-800 text-white'>
                        {plan.name === 'Team' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
                Join thousands of tech professionals who are already using
                Resumee.me to boost their careers.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent className='p-6'>
                    <form className='space-y-4'>
                      <Input
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

      <footer className='bg-white border-t text-gray-600 py-12 px-4 sm:px-6 lg:px-8 mt-20'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Product</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Company</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Resources</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-gray-800 transition-colors'
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-gray-200 text-center'>
            <p>
              &copy; {new Date().getFullYear()} Resumee.me. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
