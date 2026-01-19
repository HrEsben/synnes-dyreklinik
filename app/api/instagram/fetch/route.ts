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

    // Try to fetch from Instagram's JSON endpoint
    // Note: This is a public endpoint but may not always work
    try {
      const instagramJsonUrl = `https://www.instagram.com/p/${postId}/?__a=1&__d=dis`
      const response = await fetch(instagramJsonUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        // Extract data from Instagram's response
        const mediaItem = data?.items?.[0] || data?.graphql?.shortcode_media
        
        if (mediaItem) {
          const imageUrl = mediaItem.display_url || 
                          mediaItem.image_versions2?.candidates?.[0]?.url ||
                          mediaItem.thumbnail_url
          
          const caption = mediaItem.caption?.text || 
                         mediaItem.edge_media_to_caption?.edges?.[0]?.node?.text || 
                         ''

          return NextResponse.json({
            id: postId,
            url: url,
            image_url: imageUrl,
            caption: caption,
          })
        }
      }
    } catch (error) {
      console.error('Instagram JSON endpoint failed:', error)
    }

    // Fallback: Return basic data extracted from URL
    // User will need to manually add image URL and caption
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
