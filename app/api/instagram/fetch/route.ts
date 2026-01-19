import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL er påkrævet' },
        { status: 400 }
      )
    }

    // Validate Instagram URL
    const instagramRegex = /instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/
    const match = url.match(instagramRegex)

    if (!match) {
      return NextResponse.json(
        { error: 'Ugyldig Instagram URL' },
        { status: 400 }
      )
    }

    const postId = match[2]

    // Use Instagram's official oEmbed API
    try {
      const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=YOUR_ACCESS_TOKEN`
      
      // Try without access token first (public endpoint)
      const publicOembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`
      
      const response = await fetch(publicOembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SynnesDyreklinik/1.0)',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        // Extract thumbnail URL from oEmbed response
        const imageUrl = data.thumbnail_url || ''
        const caption = data.title || ''

        return NextResponse.json({
          id: postId,
          url: url,
          image_url: imageUrl,
          caption: caption,
        })
      }
    } catch (error) {
      console.error('Instagram oEmbed failed:', error)
    }

    // If oEmbed fails, return basic data
    return NextResponse.json({
      id: postId,
      url: url,
      image_url: '',
      caption: '',
      warning: 'Kunne ikke hente post-data automatisk. Indtast venligst billedURL og tekst manuelt.',
    })

  } catch (error) {
    console.error('Error fetching Instagram post:', error)
    return NextResponse.json(
      { error: 'Kunne ikke hente Instagram post' },
      { status: 500 }
    )
  }
}
