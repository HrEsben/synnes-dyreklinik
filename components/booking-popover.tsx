'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import BookingFrame from './booking-frame'
import { X } from 'lucide-react'

interface BookingPopoverProps {
  children: React.ReactNode
  onOpen?: () => void
}

export default function BookingPopover({ children, onOpen }: BookingPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(true)
    if (onOpen) {
      onOpen()
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      <div onClick={handleTriggerClick}>
        {children}
      </div>
      
      {/* Full screen modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          {/* Backdrop - click to close */}
          <div 
            className="absolute inset-0 bg-black/50 cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-label="Luk modal"
          />
          
          {/* Modal content */}
          <div 
            className="relative bg-white w-full h-full sm:w-[95vw] sm:h-[85vh] sm:max-w-6xl sm:rounded-lg overflow-hidden shadow-2xl z-10"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Book tid hos Synne&apos;s Dyreklinik
              </h2>
              <Button
                variant="ghost"
                size="default"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:text-white hover:bg-[#f97561] bg-[#ffca0f] cursor-pointer rounded-[8px] transition-all duration-200 ease-in-out group"
              >
                <X className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-90" />
                <span className="sr-only">Luk booking</span>
              </Button>
            </div>
            
            {/* Booking iframe */}
            <div className="p-2 sm:p-4 h-[calc(100%-8rem)] sm:h-[calc(100%-6rem)]">
              <BookingFrame
                src="https://www.vettigo.dk/booking.php?_klinik=syn999"
                title="Synne's Dyreklinik Booking System"
                height="100%"
                className="w-full h-full"
              />
            </div>
            
            {/* Footer with contact info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t p-2 sm:p-3">
              <div className="text-center text-xs sm:text-sm text-gray-600">
                <p className="hidden sm:block">Problemer med booking? Kontakt os på{' '}
                  <a href="tel:49400599" className="text-blue-600 hover:underline font-medium">
                    49 40 05 99
                  </a>{' '}
                  eller{' '}
                  <a href="mailto:synne@synnesdyreklinik.dk" className="text-blue-600 hover:underline font-medium">
                    synne@synnesdyreklinik.dk
                  </a>
                </p>
                <p className="sm:hidden">
                  <a href="tel:49400599" className="text-blue-600 hover:underline font-medium">
                    Ring 49 40 05 99
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
