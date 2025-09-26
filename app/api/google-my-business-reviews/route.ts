import { NextRequest, NextResponse } from 'next/server'

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
  totalReviewCount: number
  averageRating: number
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
    
    // Get API credentials from environment variables
    const apiKey = process.env.GOOGLE_MY_BUSINESS_API_KEY
    const businessAccountId = process.env.GOOGLE_MY_BUSINESS_ACCOUNT_ID
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google My Business API key not configured' },
        { status: 500 }
      )
    }
    
    if (!businessAccountId) {
      return NextResponse.json(
        { error: 'Google My Business Account ID not configured' },
        { status: 500 }
      )
    }
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    // Construct the My Business API URL
    // Note: The exact endpoint structure depends on your specific My Business setup
    const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${businessAccountId}/locations/${placeId}/reviews`
    
    // Fetch from Google My Business API
    const response = await fetch(
      `${apiUrl}?key=${apiKey}&pageSize=${maxResults}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`, // You might need OAuth2 token instead
        },
      }
    )
    
    if (!response.ok) {
      // If My Business API fails, fall back to mock data
      console.warn(`My Business API request failed: ${response.statusText}`)
      
      // Return mock data as fallback
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
    
    const data: GoogleMyBusinessResponse = await response.json()
    
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
      rating: data.averageRating,
      totalReviews: data.totalReviewCount,
      source: 'google-my-business'
    })
    
  } catch (error) {
    console.error('Error fetching Google My Business reviews:', error)
    
    // Return mock data as fallback on any error
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
      source: 'fallback',
      error: 'API temporarily unavailable'
    })
  }
}