'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from './ui/button'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Set initial scroll position on mount
    setScrollY(window.scrollY)

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calculate opacity based on scroll position (0 to 0.95)
  const backgroundOpacity = Math.min(scrollY / 20, 0.98)

  if (loading) {
    return (
      <nav className="bg-white">
        <div className="mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/logo.svg"
                alt="Synnes Dyreklinik"
                width={160}
                height={66}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav>
      <div 
        className="lg:px-6 z-50 fixed top-0 right-0 left-0 transition-all duration-300"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          boxShadow: `10px 10px 42px 0 rgba(8, 15, 52, ${backgroundOpacity * 0.06})`
        }}
      >
        <div className="max-w-[1257px] mx-auto px-6 md:px-0 py-5 lg:py-7 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex justify-between items-center">
              <Image
                src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/logo.svg"
                alt="Synnes Dyreklinik"
                width={160}
                height={66}
                className="h-15 w-auto"
              />
            </Link>
          </div>
          
          <nav role="navigation" aria-label="Hovednavigation">
            <ul className="hidden md:flex items-center list-none">
              <li>
                <Link href="/">
                  <Button variant="link">
                    Forside
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/om">
                  <Button variant="link">
                    Hvem er vi
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/kontakt">
                  <Button variant="link">
                    Kontakt
                  </Button>
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/dashboard">
                    <Button variant="link">
                      Dashboard
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
                <Button 
                  onClick={() => supabase.auth.signOut()}
                >
                  Log ud
                </Button>
              </div>
            ) : (
              <Link 
                href="/login" 
              >
                <Button>
                  Book tid
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
