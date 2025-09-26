'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EditableText from '@/components/editable-text'

interface GoogleReview {
  id: string
  author: string
  rating: number
  text: string
  timeDescription: string
}

// Mock data - used when Google API is not available
const mockReviews: GoogleReview[] = [
  {
    id: '1',
    author: 'Sally',
    rating: 5,
    text: 'En virkelig kompetent og behagelig dyrlæge. Begge vores hunde havde behov for akut dyrlæge, og vi fik tid med det samme. De gør meget for at både dyr og ejer føler sig velkommen og set. Fik haste opereret min tæve pga livmoderbetændelse, og de behandlede det hele så professionelt. Selve ejeren, Synne kom ind på sin fridag for at operere. Ville ønske jeg kunne give flere stjerner, men de må "nøjes" med de fem man kan give.',
    timeDescription: 'for 2 uger siden'
  },
  {
    id: '2',
    author: 'Klaus Petersen',
    rating: 5,
    text: 'De står altid klar til at hjælpe hvis ens hund ikke har det godt, de er kompetente, dygtige & bare rigtig søde mennesker.',
    timeDescription: 'for 4 måneder siden'
  },
  {
    id: '3',
    author: 'H. Nielsen',
    rating: 5,
    text: 'Jeg har haft min dejlige hunkat Maui (ca. 6 1/2 år) hos dyrlæge Synne flere gange. Jeg har fået en særdeles god/grundig rådgivning/undersøgelse af katten, og senere en "komplet" udredning af min kats symptomer/sygdom. Jeg vil helt klart anbefale Synnes Dyreklinik til andre.',
    timeDescription: 'for ét år siden'
  }
]

interface GoogleReviewsProps {
  placeId?: string
  maxReviews?: number
  className?: string
  useMockData?: boolean
  useMyBusinessAPI?: boolean // Use Google My Business API instead of Places API
}

export default function GoogleReviews({
  placeId,
  maxReviews = 6,
  className = '',
  useMockData = false,
  useMyBusinessAPI = false
}: GoogleReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviews, setReviews] = useState<GoogleReview[]>(mockReviews)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch reviews from Google API
  const fetchGoogleReviews = async () => {
    if (!placeId || useMockData) {
      console.log('Using mock data')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const apiEndpoint = useMyBusinessAPI ? '/api/google-my-business-reviews' : '/api/google-reviews'
      const response = await fetch(`${apiEndpoint}?placeId=${encodeURIComponent(placeId)}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (data.reviews && Array.isArray(data.reviews)) {
        setReviews(data.reviews)
      }
    } catch (err) {
      console.error('Error fetching Google reviews:', err)
      setError('Failed to load Google reviews. Using fallback data.')
      setReviews(mockReviews)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoogleReviews()
  }, [placeId, useMockData, useMyBusinessAPI])

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 5

  const displayedReviews = reviews.slice(0, maxReviews)

  const nextReviews = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= displayedReviews.length ? 0 : prev + 3
    )
  }

  const prevReviews = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(displayedReviews.length - 3, 0) : prev - 3
    )
  }

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 20 : 16
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={starSize}
            className={`${
              index < Math.floor(rating)
                ? 'fill-[#ffca0e] text-[#ffca0e]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div className={`py-16 lg:py-20 ${className}`}>
      <div className="max-w-[1257px] mx-auto px-6">
        {isLoading && (
          <div className="text-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ed6e21] mx-auto mb-2"></div>
            <p className="text-muted-foreground">Indlæser anmeldelser...</p>
          </div>
        )}

        {error && (
          <div className="text-center mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className={isLoading ? 'opacity-50' : ''}>
          <div className="text-center mb-8">
            <EditableText
              contentKey="google_reviews_heading"
              defaultValue="Hvad siger vores kunder?"
              tag="h2"
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-accent-foreground mb-4"
            />
            <EditableText
              contentKey="google_reviews_description"
              defaultValue="Se hvad andre dyreejere siger om deres oplevelser hos Synnes Dyreklinik"
              tag="p"
              className="text-lg font-semibold text-muted-foreground max-w-2xl mx-auto mb-8"
            />
            
            <Link href="https://www.google.com/maps/search/synnes+dyreklinik">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="font-bold text-gray-800">Google</span>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(averageRating, 'lg')}
                <span className="text-lg font-bold text-accent-foreground">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
</Link>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {displayedReviews.slice(currentIndex, currentIndex + 3).map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-4xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7d1e82] to-[#ed6e21] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {getInitials(review.author)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-accent-foreground">{review.author}</h3>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.timeDescription}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {truncateText(review.text, 150)}
                  </p>
                </div>
              ))}
            </div>

            {displayedReviews.length > 3 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={prevReviews}
                  variant="outline"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(displayedReviews.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index * 3)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(currentIndex / 3) === index
                          ? 'bg-[#ed6e21]'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  onClick={nextReviews}
                  variant="outline"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </div>

          <div className="lg:hidden space-y-6">
            {displayedReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-4xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7d1e82] to-[#ed6e21] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {getInitials(review.author)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-accent-foreground text-sm">{review.author}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.timeDescription}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {truncateText(review.text, 120)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}