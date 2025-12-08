'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an error reporting service in production
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#fffaf6]">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 
            className="text-2xl font-extrabold text-[#2c2524] mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Der opstod en fejl
          </h1>
          <p className="text-[#817d7d] mb-6">
            Siden kunne ikke indlæses korrekt. Prøv venligst igen.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4 text-left mb-6 overflow-auto max-h-40">
              <p className="text-sm font-mono text-red-600 break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Prøv igen
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Gå til forsiden
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
