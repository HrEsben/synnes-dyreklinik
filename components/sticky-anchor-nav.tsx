'use client'

import { useEffect, useState } from 'react'
import { ReactNode } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StickyAnchorNavProps {
  services: Array<{
    id: string
    label: string
    href: string
    icon?: ReactNode
  }>
}

export default function StickyAnchorNav({ services }: StickyAnchorNavProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [topOffset, setTopOffset] = useState(88) // Default header height
  const [isMobile, setIsMobile] = useState(false)
  const [currentService, setCurrentService] = useState<string>('')

  const handleSelectChange = (serviceId: string) => {
    setCurrentService(serviceId)
    // Trigger the same scroll behavior as anchor clicks
    const targetElement = document.getElementById(serviceId)
    if (targetElement) {
      const navHeight = 80 // Approximate height of main navigation
      const stickyNavHeight = 64 // Height of this sticky nav
      const alertBanner = document.querySelector('[data-alert-banner]')
      const alertHeight = alertBanner ? alertBanner.getBoundingClientRect().height : 0
      
      const totalOffset = navHeight + stickyNavHeight + alertHeight + 60 // Increased from 20px to 60px for more offset
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - totalOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const navHeight = 80 // Approximate height of main navigation
      const stickyNavHeight = 64 // Height of this sticky nav
      const alertBanner = document.querySelector('[data-alert-banner]')
      const alertHeight = alertBanner ? alertBanner.getBoundingClientRect().height : 0
      
      const totalOffset = navHeight + stickyNavHeight + alertHeight + 60 // Increased from 20px to 60px for more offset
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - totalOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint is 768px
    }

    // Initial check
    checkScreenSize()

    const calculateTopOffset = () => {
      // The navigation is fixed and based on the mobile drawer position (top-[88px]),
      // we know the navigation height should be 88px
      let navHeight = 88
      
      // Try to get more accurate measurement from the actual navigation
      const navContainer = document.querySelector('nav') as HTMLElement
      if (navContainer) {
        const fixedNavBar = navContainer.querySelector('div[class*="fixed"]') as HTMLElement
        if (fixedNavBar) {
          navHeight = fixedNavBar.offsetHeight
        }
      }
      
      // Look for alert banner
      const alertBanner = document.querySelector('div[class*="fixed"][class*="border-b"][class*="z-[60]"]') as HTMLElement
      
      let alertHeight = 0
      if (alertBanner) {
        // Check if the alert banner is actually visible
        const computedStyle = window.getComputedStyle(alertBanner)
        if (computedStyle.display !== 'none' && alertBanner.offsetHeight > 0) {
          alertHeight = alertBanner.offsetHeight
        }
      }
      
      // When there's no alert, position 15px higher for better visual spacing
      // When there's an alert, position directly below it (alert already includes nav positioning)
      let totalOffset
      if (alertHeight > 0) {
        // Alert banner is positioned relative to nav, so we need nav height + alert height
        // But we want to stick right below the alert, so we use the alert's bottom position
        const alertBanner = document.querySelector('div[class*="fixed"][class*="border-b"][class*="z-[60]"]') as HTMLElement
        if (alertBanner) {
          const alertRect = alertBanner.getBoundingClientRect()
          totalOffset = alertRect.bottom
        } else {
          totalOffset = navHeight + alertHeight
        }
      } else {
        // No alert: position with more spacing above navigation bottom
        totalOffset = navHeight
      }
      
      return totalOffset
    }

    const handleScroll = () => {
      // Don't enable sticky behavior on mobile screens
      if (isMobile) {
        setIsSticky(false)
        return
      }

      const heroSection = document.querySelector('#hero-section')
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        const newTopOffset = calculateTopOffset()
        
        setTopOffset(newTopOffset)
        setIsSticky(heroBottom <= newTopOffset)
      }
    }

    const handleResize = () => {
      checkScreenSize()
      const newOffset = calculateTopOffset()
      setTopOffset(newOffset)
    }

    // Initial calculation with a slight delay to ensure DOM is ready
    const initialCalculation = () => {
      const newOffset = calculateTopOffset()
      setTopOffset(newOffset)
      handleScroll()
    }

    setTimeout(initialCalculation, 100)

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Observer for DOM changes (alert banner appearing/disappearing)
    const observer = new MutationObserver(() => {
      const newOffset = calculateTopOffset()
      setTopOffset(newOffset)
    })

    // Observe changes in the body for alert banner changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [isMobile])

  return (
    <>
      {/* Placeholder element to maintain space when sticky - only on desktop */}
      {isSticky && !isMobile && (
        <div 
          className="bg-white border-b border-gray-200 py-4 px-4 md:px-6"
          style={{ height: '64px' }} // Match the height of the actual navigation
        />
      )}
      
      <section 
        className={`transition-all duration-300 z-30 bg-white border-b border-gray-200 py-4 ${
          isSticky && !isMobile ? 'fixed left-0 right-0 shadow-md' : 'relative'
        }`}
        style={{ 
          top: isSticky && !isMobile ? `${topOffset}px` : 'auto' 
        }}
      >
        <div className="px-4 md:px-6">
          {/* Mobile Select Dropdown */}
          <div className="md:hidden">
            <Select value={currentService} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vælg en ydelse" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center gap-2">
                      {service.icon && (
                        <span className="text-[#f97561] flex-shrink-0">
                          {service.icon}
                        </span>
                      )}
                      <span>{service.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex justify-center">
            <nav className="flex gap-4 flex-wrap">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#f97561] transition-colors duration-200 whitespace-nowrap"
                  onClick={(e) => handleAnchorClick(e, service.id)}
                >
                  {service.icon && (
                    <span className="text-[#f97561] flex-shrink-0">
                      {service.icon}
                    </span>
                  )}
                  <span>{service.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </>
  )
}