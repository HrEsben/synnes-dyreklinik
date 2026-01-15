import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

// Mock data fallback
const mockReviews = [
  {
    id: 'mock-1',
    author: 'Sally',
    rating: 5,
    text: 'En virkelig kompetent og behagelig dyrlæge. Begge vores hunde havde behov for akut dyrlæge, og vi fik tid med det samme. De gør meget for at både dyr og ejer føler sig velkommen og set. Fik haste opereret min tæve pga livmoderbetændelse, og de behandlede det hele så professionelt. Selve ejeren, Synne kom ind på sin fridag for at operere. Ville ønske jeg kunne give flere stjerner, men de må "nøjes" med de fem man kan give.',
    timeDescription: 'for 2 uger siden'
  },
  {
    id: 'mock-2',
    author: 'Klaus Petersen',
    rating: 5,
    text: 'De står altid klar til at hjælpe hvis ens hund ikke har det godt, de er kompetente, dygtige & bare rigtig søde mennesker.',
    timeDescription: 'for 4 måneder siden'
  },
  {
    id: 'mock-3',
    author: 'H. Nielsen',
    rating: 5,
    text: 'Jeg har haft min dejlige hunkat Maui (ca. 6 1/2 år) hos dyrlæge Synne flere gange. Jeg har fået en særdeles god/grundig rådgivning/undersøgelse af katten, og senere en "komplet" udredning af min kats symptomer/sygdom. Jeg vil helt klart anbefale Synnes Dyreklinik til andre.',
    timeDescription: 'for ét år siden'
  }
]

interface GooglePlacesResponse {
  result: {
    name: string
    rating: number
    user_ratings_total: number
    reviews: Array<{
      author_name: string
      author_url: string
      language: string
      profile_photo_url?: string
      rating: number
      relative_time_description: string
      text: string
      time: number
    }>
  }
  status: string
}

interface CachedReview {
  id: string
  author: string
  rating: number
  text: string
  timeDescription: string
  time?: number
  profile_photo_url?: string
  author_url?: string
}

// Create Supabase client for cache management
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

// Check if cached data is still valid
async function getCachedReviews(placeId: string): Promise<{
  reviews: CachedReview[]
  rating: number
  totalReviews: number
} | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null
  
  const { data, error } = await supabase
    .from('google_reviews_cache')
    .select('reviews, rating, total_reviews, expires_at')
    .eq('place_id', placeId)
    .single()
  
  if (error || !data) return null
  
  // Check if cache has expired
  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    return null
  }
  
  return {
    reviews: data.reviews as CachedReview[],
    rating: data.rating,
    totalReviews: data.total_reviews
  }
}

// Save reviews to cache
async function cacheReviews(
  placeId: string, 
  reviews: CachedReview[], 
  rating: number, 
  totalReviews: number
): Promise<void> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return
  
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour cache
  
  const { error } = await supabase
    .from('google_reviews_cache')
    .upsert({
      place_id: placeId,
      reviews: reviews,
      rating: rating,
      total_reviews: totalReviews,
      cached_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'place_id'
    })
  
  if (error) {
    logger.error('Failed to cache reviews:', { error: error.message })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')
    
    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    // If no API key configured, return mock data
    if (!apiKey) {
      logger.info('Google Places API key not configured, using mock data')
      return NextResponse.json({
        reviews: mockReviews,
        rating: 5.0,
        totalRatings: mockReviews.length,
        source: 'mock'
      })
    }
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    // Try to get cached data first
    const cached = await getCachedReviews(placeId)
    if (cached) {
      logger.info('Returning cached Google reviews', { placeId })
      return NextResponse.json({
        reviews: cached.reviews,
        rating: cached.rating,
        totalRatings: cached.totalReviews,
        source: 'cache'
      })
    }
    
    // Fetch from Google Places API
    logger.info('Fetching fresh Google reviews', { placeId })
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&language=da&key=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Google API request failed: ${response.statusText}`)
    }
    
    const data: GooglePlacesResponse = await response.json()
    
    // Check if the API request was successful
    if (data.status !== 'OK') {
      logger.error('Google Places API Error:', {
        status: data.status,
        placeId
      })
      
      // Return mock data as fallback
      return NextResponse.json({
        reviews: mockReviews,
        rating: 5.0,
        totalRatings: mockReviews.length,
        source: 'mock-fallback'
      })
    }
    
    // Transform the data to match our component interface
    const transformedReviews: CachedReview[] = data.result?.reviews?.map(review => ({
      id: review.author_name + review.time,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      timeDescription: review.relative_time_description,
      time: review.time,
      profile_photo_url: review.profile_photo_url,
      author_url: review.author_url
    })) || []
    
    const rating = data.result.rating || 5.0
    const totalRatings = data.result.user_ratings_total || 0
    
    // Cache the results for 24 hours
    await cacheReviews(placeId, transformedReviews, rating, totalRatings)

    return NextResponse.json({
      reviews: transformedReviews,
      rating,
      totalRatings,
      source: 'google-places'
    })
  } catch (error) {
    logger.error('Error fetching Google reviews:', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    
    // Return mock data on error
    return NextResponse.json({
      reviews: mockReviews,
      rating: 5.0,
      totalRatings: mockReviews.length,
      source: 'mock-error'
    })
  }
}
