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
  const [isHydrated, setIsHydrated] = useState(false)
  const supabase = createClient()

  // Delayed hydration to prevent layout shifts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 400) // Øget delay for mere stabilitet
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setLoading(false)
      }
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

  // Stable scroll tracking - only after hydration with delay
  useEffect(() => {
    if (!isHydrated) return
    
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY || 0)
          ticking = false
        })
        ticking = true
      }
    }

    // Additional delay before starting scroll tracking
    const timer = setTimeout(() => {
      setScrollY(window.scrollY || 0)
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 500) // Øget delay for mere stabilitet
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHydrated])

  // Menu handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Stable background opacity calculation
  const backgroundOpacity = isHydrated ? Math.min(scrollY / 20, 0.98) : 0

  // Show simple loading state to prevent layout shift
  if (!isHydrated || loading) {
    return (
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
        style={{ 
          backgroundColor: `rgba(255, 255, 255, 1)`,
          backdropFilter: 'blur(10px)',
          height: '80px' // Fixed height to prevent layout shift
        }}
      >
        <div className="mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div style={{ width: '120px', height: '48px' }} className="bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-16 h-4 bg-gray-100 animate-pulse rounded" />
              <div className="w-16 h-4 bg-gray-100 animate-pulse rounded" />
              <div className="w-16 h-4 bg-gray-100 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Force page refresh to clear any cached state
    window.location.reload()
  }

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          backdropFilter: backgroundOpacity > 0 ? 'blur(10px)' : 'none',
          transition: 'background-color 0.3s ease',
          height: '80px' // Fixed height
        }}
      >
        <div className="mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div style={{ width: '120px', height: '48px' }}>
                  <Image
                    src="https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/kombi-logo.png"
                    alt="Synnes Dyreklinik"
                    width={120}
                    height={48}
                    className="h-12 w-auto"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-900 hover:text-[#f97561] transition-colors font-medium"
              >
                Forside
              </Link>
              <BookingPopover>
                <span className="text-gray-900 hover:text-[#f97561] transition-colors font-medium cursor-pointer">
                  Book tid
                </span>
              </BookingPopover>
              <Link 
                href="/kontakt" 
                className="text-gray-900 hover:text-[#f97561] transition-colors font-medium"
              >
                Kontakt
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Logget ind som {user.email}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                  >
                    Log ud
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log ind
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Hamburger 
                toggled={isMenuOpen} 
                toggle={setIsMenuOpen}
                size={24}
                color="#2c2524"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <nav className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl">
            <div className="p-6 pt-20">
              <div className="space-y-6">
                <Link 
                  href="/" 
                  className="block text-gray-900 hover:text-[#f97561] transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Forside
                </Link>
                <Link 
                  href="/booking" 
                  className="block text-gray-900 hover:text-[#f97561] transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book tid
                </Link>
                <Link 
                  href="/kontakt" 
                  className="block text-gray-900 hover:text-[#f97561] transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Link>
                
                <div className="pt-6 border-t">
                  {user ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Logget ind som {user.email}
                      </p>
                      <Button 
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full"
                      >
                        Log ud
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log ind
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
      
      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div style={{ height: '80px' }} />
    </>
  )
}
