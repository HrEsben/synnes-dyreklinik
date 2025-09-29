import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // This endpoint is currently not implemented
    // Google My Business API requires OAuth 2.0 and special approval
    
    // For now, return mock data since we don't have credentials yet
    // When you get the credentials, uncomment the API call below
    
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
    
    /* 
    // Uncomment this section when you have the Google My Business API credentials:
    
    if (!apiKey || !businessAccountId) {
      console.warn('Google My Business API credentials not configured, using mock data')
      return NextResponse.json({
        reviews: mockReviews,
        rating: 5.0,
        totalReviews: 3,
        source: 'mock'
      })
    }
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }
    
    // Construct the My Business API URL
    const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${businessAccountId}/locations/${placeId}/reviews`
    
    // Fetch from Google My Business API
    const response = await fetch(
      `${apiUrl}?key=${apiKey}&pageSize=${maxResults}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`My Business API request failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Transform the data to match our interface
    const transformedReviews = data.reviews?.map((review: any, index: number) => ({
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
    */
    
    return NextResponse.json({
      reviews: mockReviews,
      rating: 5.0,
      totalReviews: 3,
      source: 'mock'
    })
    
  } catch (error) {
    console.error('Error fetching Google My Business reviews:', error)
    
    // Return mock data as fallback on any error
    const mockReviews = [
      {
        id: 'mock-1',
        author: 'Sally',
        rating: 5,
        text: 'En virkelig kompetent og behagelig dyrlæge. Begge vores hunde havde behov for akut dyrlæge, og vi fik tid med det samme.',
        timeDescription: 'for 2 uger siden'
      },
      {
        id: 'mock-2',
        author: 'Klaus Petersen',
        rating: 5,
        text: 'De står altid klar til at hjælpe hvis ens hund ikke har det godt, de er kompetente, dygtige & bare rigtig søde mennesker.',
        timeDescription: 'for 4 måneder siden'
      }
    ]
    
    return NextResponse.json({
      reviews: mockReviews,
      rating: 5.0,
      totalReviews: 2,
      source: 'fallback',
      error: 'API temporarily unavailable'
    })
  }
}