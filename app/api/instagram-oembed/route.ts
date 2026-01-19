import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface InstagramOEmbedResponse {
  thumbnail_url: string
  author_name: string
  media_id: string
  title: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
    }
    
    // Instagram oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN || ''}`
    
    const response = await fetch(oembedUrl)
    
    if (!response.ok) {
      // Fallback: extract post ID from URL and construct thumbnail URL
      const postIdMatch = url.match(/\/p\/([^\/]+)/)
      if (postIdMatch) {
        const postId = postIdMatch[1]
        return NextResponse.json({
          thumbnail_url: `https://www.instagram.com/p/${postId}/media/?size=m`,
          author_name: '',
          media_id: postId,
          title: ''
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch Instagram data' },
        { status: response.status }
      )
    }
    
    const data: InstagramOEmbedResponse = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Instagram oEmbed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
