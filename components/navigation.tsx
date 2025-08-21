'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from './ui/button'
import { Spin as Hamburger } from 'hamburger-react'
import BookingPopover from './booking-popover'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

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
        className="px-0 md:px-6 z-50 fixed top-0 right-0 left-0 transition-all duration-300"
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
          
          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Hovednavigation" className="hidden md:block">
            <ul className="flex items-center list-none">
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
                <BookingPopover>
                  <Button>
                    Book tid
                  </Button>
                </BookingPopover>
                <Button 
                  onClick={() => supabase.auth.signOut()}
                  variant="outline"
                >
                  Log ud
                </Button>
              </div>
            ) : (
              <BookingPopover>
                <Button>
                  Book tid
                </Button>
              </BookingPopover>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className={`md:hidden rounded-xl transition-colors duration-300 ease-in ${
            isMenuOpen ? 'bg-[#ffca0f]' : 'bg-[#f97561]'
          }`}>
            <Hamburger 
              toggled={isMenuOpen} 
              toggle={setIsMenuOpen}
              size={24}
              color="#fff"
              easing='ease-in-out'
              rounded
              label="Menu"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-[88px] left-0 w-full bg-white bg-opacity-95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: 'calc(100vh - 88px)' }}
      >
        <div className="h-full flex flex-col p-6">
          <nav role="navigation" aria-label="Mobil navigation" className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="link" className="text-2xl font-bold w-full justify-start text-left px-0 hover:bg-gray-50">
                    Forside
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/om" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="link" className="text-2xl font-bold w-full justify-start text-left px-0 hover:bg-gray-50">
                    Hvem er vi
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/kontakt" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="link" className="text-2xl font-bold w-full justify-start text-left px-0 hover:bg-gray-50">
                    Kontakt
                  </Button>
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="link" className="text-2xl font-bold w-full justify-start text-left p-4 hover:bg-gray-50">
                      Dashboard
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile CTA Button - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 pt-4 pb-2">
            {user ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 px-4">
                  {user.email}
                </div>
                <Button 
                  onClick={() => {
                    supabase.auth.signOut()
                    setIsMenuOpen(false)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Log ud
                </Button>
                <BookingPopover>
                  <Button className="w-full">
                    Book tid
                  </Button>
                </BookingPopover>
              </div>
            ) : (
              <BookingPopover>
                <Button className="w-full">
                  Book tid
                </Button>
              </BookingPopover>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
