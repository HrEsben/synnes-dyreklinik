import { NextRequest, NextResponse } from 'next/server'

interface GooglePlacesResponse {
  result: {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get('placeId')
    
    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      )
    }
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    // Fetch from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`,
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
    
    if (data.status !== 'OK') {
      throw new Error(`Google API error: ${data.status}`)
    }
    
    // Transform the data to match our interface
    const transformedReviews = data.result.reviews?.map((review, index) => ({
      id: `google-${index}`,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      timeDescription: review.relative_time_description,
      profilePhotoUrl: review.profile_photo_url,
      time: review.time
    })) || []
    
    return NextResponse.json({
      reviews: transformedReviews,
      rating: data.result.rating,
      totalRatings: data.result.user_ratings_total
    })
    
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}