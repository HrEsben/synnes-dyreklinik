import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

interface GoogleMyBusinessReview {
  reviewId: string
  reviewer: {
    profilePhotoUrl?: string
    displayName: string
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

interface GoogleMyBusinessResponse {
  reviews: GoogleMyBusinessReview[]
  nextPageToken?: string
  totalReviewCount?: number
  averageRating?: number
}

// Initialize Google Auth
const getGoogleAuth = () => {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  
  if (serviceAccountKey) {
    // Use service account authentication
    return new GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/business.manage']
    })
  }
  
  // Fallback to API key (less secure)
  return null
}

// Convert star rating enum to number
const convertStarRating = (starRating: string): number => {
  const ratings: { [key: string]: number } = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5
  }
  return ratings[starRating] || 5
}

// Convert timestamp to relative time description in Danish
const getRelativeTimeDescription = (timestamp: string): string => {
  const reviewDate = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'i dag'
  if (diffInDays === 1) return 'i går'
  if (diffInDays < 7) return `for ${diffInDays} dage siden`
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return weeks === 1 ? 'for 1 uge siden' : `for ${weeks} uger siden`
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? 'for 1 måned siden' : `for ${months} måneder siden`
  }
  const years = Math.floor(diffInDays / 365)
  return years === 1 ? 'for 1 år siden' : `for ${years} år siden`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')
    const maxResults = parseInt(searchParams.get('maxResults') || '10')
    
    // Get configuration from environment
    const businessAccountId = process.env.GOOGLE_MY_BUSINESS_ACCOUNT_ID
    const apiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY
    
    if (!businessAccountId) {
      console.warn('Google My Business Account ID not configured, using fallback data')
      return getFallbackReviews()
    }
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    // Try to get authenticated client
    const auth = getGoogleAuth()
    let authHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json'
    }
    
    if (auth) {
      // Use service account authentication
      try {
        const client = await auth.getClient()
        const accessToken = await client.getAccessToken()
        if (accessToken.token) {
          authHeaders['Authorization'] = `Bearer ${accessToken.token}`
        }
      } catch (authError) {
        console.warn('Service account authentication failed:', authError)
        if (apiKey) {
          // Fallback to API key
          authHeaders = {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
          }
        } else {
          return getFallbackReviews()
        }
      }
    } else if (apiKey) {
      // Use API key authentication
      authHeaders['X-API-Key'] = apiKey
    } else {
      console.warn('No authentication method available, using fallback data')
      return getFallbackReviews()
    }
    
    // Construct the My Business API URL
    // Updated API endpoint (v4 is deprecated, using latest version)
    const apiUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${businessAccountId}/locations/${placeId}/reviews`
    
    // Fetch from Google My Business API
    const response = await fetch(
      `${apiUrl}?pageSize=${maxResults}`,
      {
        headers: authHeaders,
      }
    )
    
    if (!response.ok) {
      console.warn(`My Business API request failed: ${response.status} ${response.statusText}`)
      
      // Try the legacy API endpoint as fallback
      const legacyUrl = `https://mybusiness.googleapis.com/v4/accounts/${businessAccountId}/locations/${placeId}/reviews`
      const legacyResponse = await fetch(
        `${legacyUrl}?pageSize=${maxResults}`,
        { headers: authHeaders }
      )
      
      if (!legacyResponse.ok) {
        console.warn('Legacy API also failed, using fallback data')
        return getFallbackReviews()
      }
      
      const legacyData: GoogleMyBusinessResponse = await legacyResponse.json()
      return transformAndReturnReviews(legacyData)
    }
    
    const data: GoogleMyBusinessResponse = await response.json()
    return transformAndReturnReviews(data)
    
  } catch (error) {
    console.error('Error fetching Google My Business reviews:', error)
    return getFallbackReviews()
  }
}

function transformAndReturnReviews(data: GoogleMyBusinessResponse) {
  // Transform the data to match our interface
  const transformedReviews = data.reviews?.map((review, index) => ({
    id: review.reviewId || `mybusiness-${index}`,
    author: review.reviewer.displayName,
    rating: convertStarRating(review.starRating),
    text: review.comment || '',
    timeDescription: getRelativeTimeDescription(review.createTime),
    profilePhotoUrl: review.reviewer.profilePhotoUrl,
    createTime: review.createTime,
    hasReply: !!review.reviewReply
  })) || []
  
  return NextResponse.json({
    reviews: transformedReviews,
    rating: data.averageRating || (transformedReviews.length > 0 
      ? transformedReviews.reduce((sum, review) => sum + review.rating, 0) / transformedReviews.length 
      : 5.0),
    totalReviews: data.totalReviewCount || transformedReviews.length,
    source: 'google-my-business'
  })
}

function getFallbackReviews() {
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
  
  return NextResponse.json({
    reviews: mockReviews,
    rating: 5.0,
    totalReviews: 3,
    source: 'fallback'
  })
}