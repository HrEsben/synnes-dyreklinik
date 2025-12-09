'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AnchorLink {
  id: string
  label: string
  href: string
}

interface PriceAnchorNavProps {
  categories: AnchorLink[]
}

export default function PriceAnchorNav({ categories }: PriceAnchorNavProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check scroll position for navigation arrows
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

  useEffect(() => {
    const handleScroll = () => {
      // Check if nav should be sticky
      const heroSection = document.getElementById('hero-section')
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
        setIsSticky(window.scrollY > heroBottom - 100)
      }

      // Determine active section
      const sections = categories.map(cat => document.getElementById(cat.id))
      let currentActive = ''

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 150) {
            currentActive = categories[i].id
            break
          }
        }
      }

      setActiveSection(currentActive)
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      checkScrollPosition()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [categories])

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      const offset = 160
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div 
      className={`bg-white transition-all duration-300 z-40 ${
        isSticky ? 'fixed top-[88px] left-0 right-0 shadow-md pt-8' : 'relative'
      }`}
    >
      <div className="max-w-[1257px] mx-auto px-4 md:px-6 relative">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex items-center justify-center gap-1 py-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                onClick={(e) => handleAnchorClick(e, category.href)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === category.id
                    ? 'bg-[#f97561] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {category.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation with Scroll */}
        <div className="md:hidden relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollNav('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Scrollable Navigation */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <nav className="flex items-center gap-2 px-8">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={category.href}
                  onClick={(e) => handleAnchorClick(e, category.href)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeSection === category.id
                      ? 'bg-[#f97561] text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollNav('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
