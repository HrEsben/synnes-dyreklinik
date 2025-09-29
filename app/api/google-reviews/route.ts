import { NextRequest, NextResponse } from 'next/server'

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
    
    console.log('Making Google Places API request:', {
      placeId,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'
    })
    
    // Fetch from Google Places API (Legacy - works with API keys)
    // Added language=da to get Danish reviews in original language
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
      console.error('Google Places API Error:', {
        status: data.status,
        placeId,
        apiKeyPresent: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'
      })
      
      // Provide more specific error messages
      let errorMessage = `Google API error: ${data.status}`
      if (data.status === 'REQUEST_DENIED') {
        errorMessage += ' - Check that Places API is enabled and API key has proper permissions'
      } else if (data.status === 'INVALID_REQUEST') {
        errorMessage += ' - Invalid Place ID or request parameters'
      } else if (data.status === 'NOT_FOUND') {
        errorMessage += ' - Place ID not found'
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        errorMessage += ' - API quota exceeded'
      }
      
      throw new Error(errorMessage)
    }
    
    // Log the raw data to check language/translation
    console.log('Raw Google Places API response:', JSON.stringify(data, null, 2))

    // Transform the data to match our component interface
    const transformedReviews = data.result?.reviews?.map(review => ({
      id: review.author_name + review.time,
      author: review.author_name, // Map to 'author' that component expects
      rating: review.rating,
      text: review.text,
      timeDescription: review.relative_time_description, // Map to 'timeDescription' 
      // Keep original API data for potential future use
      time: review.time,
      profile_photo_url: review.profile_photo_url,
      author_url: review.author_url
    })) || []

    return NextResponse.json({
      reviews: transformedReviews,
      rating: data.result.rating || 5.0,
      totalRatings: data.result.user_ratings_total || 0,
      source: 'google-places'
    })  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}