'use client'

import { useEffect, useState, useRef } from 'react'
import { ReactNode } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ServiceItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
}

interface StickyAnchorNavProps {
  services: ServiceItem[]
}

// Group services into categories for better organization
const categoryLabels: Record<string, string> = {
  'basis': 'Basis ydelser',
  'kirurgi': 'Kirurgi',
  'klinisk': 'Kliniske ydelser',
  'diagnostik': 'Diagnostik',
  'special': 'Specialydelser'
}

const serviceCategories: Record<string, string[]> = {
  'basis': ['vaccinationer', 'maerkning', 'kloklip', 'foder'],
  'kirurgi': ['neutralisation-kat', 'kastration-hund', 'sterilisation-taeve', 'tumorer'],
  'klinisk': ['operation', 'tandbehandling', 'konsultation', 'sygeplejerske-konsultation'],
  'diagnostik': ['ultralydsscanning', 'roentgen', 'blodproever'],
  'special': ['kaniner', 'fysiurgi', 'haandkoeb', 'fear-free']
}

export default function StickyAnchorNav({ services }: StickyAnchorNavProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [topOffset, setTopOffset] = useState(88)
  const [isMobile, setIsMobile] = useState(false)
  const [currentService, setCurrentService] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check scroll position for arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
    }
  }

  const scrollNav = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Organize services into categories
  const getServicesByCategory = () => {
    const categorized: Record<string, ServiceItem[]> = {}
    
    Object.entries(serviceCategories).forEach(([category, serviceIds]) => {
      categorized[category] = serviceIds
        .map(id => services.find(s => s.id === id))
        .filter((s): s is ServiceItem => s !== undefined)
    })
    
    // Add any uncategorized services to a misc category
    const categorizedIds = Object.values(serviceCategories).flat()
    const uncategorized = services.filter(s => !categorizedIds.includes(s.id))
    if (uncategorized.length > 0) {
      categorized['andet'] = uncategorized
    }
    
    return categorized
  }

  const categorizedServices = getServicesByCategory()

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

  // Check scroll position on mount and when container changes
  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [isSticky])

  return (
    <>
      {/* Placeholder element to maintain space when sticky */}
      {isSticky && (
        <div 
          className="bg-white border-b border-gray-200 py-4 px-4 md:px-6"
          style={{ height: '64px' }}
        />
      )}
      
      <section 
        className={`transition-all duration-300 z-30 bg-white border-b border-gray-200 py-3 ${
          isSticky ? 'fixed left-0 right-0 shadow-md' : 'relative'
        }`}
        style={{ 
          top: isSticky ? `${topOffset}px` : 'auto' 
        }}
      >
        <div className="px-4 md:px-6">
          {/* Mobile Select Dropdown with Categories */}
          <div className="md:hidden">
            <Select value={currentService} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vælg en ydelse" />
              </SelectTrigger>
              <SelectContent className="max-h-[60vh]">
                {Object.entries(categorizedServices).map(([category, categoryServices]) => (
                  <div key={category}>
                    <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                      {categoryLabels[category] || category}
                    </div>
                    {categoryServices.map((service) => (
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
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className="flex justify-center gap-1">
              {Object.entries(categorizedServices).map(([category, categoryServices]) => (
                <div 
                  key={category} 
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* Category button */}
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#f97561] hover:bg-gray-50 rounded-lg transition-all duration-200"
                    onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  >
                    <span>{categoryLabels[category] || category}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeCategory === category ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown menu */}
                  <div 
                    className={`absolute top-full left-0 pt-1 z-50 ${
                      activeCategory === category ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[220px] transition-all duration-200">
                      {categoryServices.map((service) => (
                        <a
                          key={service.id}
                          href={`#${service.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-[#f97561] hover:bg-gray-50 transition-colors"
                          onClick={(e) => {
                            handleAnchorClick(e, service.id)
                            setActiveCategory(null)
                          }}
                        >
                          {service.icon && (
                            <span className="text-[#f97561] flex-shrink-0">
                              {service.icon}
                            </span>
                          )}
                          <span>{service.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </>
  )
}