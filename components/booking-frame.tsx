'use client'

import { useState } from 'react'

interface BookingFrameProps {
  src?: string
  title?: string
  className?: string
  height?: string | number
  width?: string | number
}

export default function BookingFrame({
  src = '',
  title = 'Booking System',
  className = '',
  height = '600px',
  width = '100%'
}: BookingFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to load booking system')
  }

  if (!src) {
    return (
      <div className={`border border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <h3 className="text-lg font-semibold mb-2">Booking System</h3>
        <p className="text-gray-600">
          Please provide the booking iframe URL to display the booking system.
        </p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg border"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading booking system...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div 
          className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <div className="text-center text-red-600">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        width={width}
        height={height}
        className={`rounded-lg border ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        allowFullScreen
        frameBorder="0"
        style={{
          minHeight: typeof height === 'number' ? `${height}px` : height,
          height: height === '100%' ? '100%' : height,
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
      />
    </div>
  )
}
