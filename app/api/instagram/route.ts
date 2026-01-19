import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: posts, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching Instagram posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error('Unexpected error fetching Instagram posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { posts } = body
    
    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { posts: Array }' },
        { status: 400 }
      )
    }
    
    // Validate each post
    for (const post of posts) {
      if (!post.id || !post.url) {
        return NextResponse.json(
          { error: 'Each post must have id and url' },
          { status: 400 }
        )
      }
    }
    
    // Upsert posts (update if exists, insert if new)
    const { error: upsertError } = await supabase
      .from('instagram_posts')
      .upsert(
        posts.map((post, index) => ({
          id: post.id,
          url: post.url,
          image_url: post.image_url || '', // Optional for embeds
          caption: post.caption || '',
          display_order: post.display_order ?? index + 1,
          is_active: post.is_active ?? true,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: 'id' }
      )
    
    if (upsertError) {
      console.error('Error upserting Instagram posts:', upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error updating Instagram posts:', error)
    return NextResponse.json(
      { error: 'Failed to update Instagram posts' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }
    
    const { error: deleteError } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', postId)
    
    if (deleteError) {
      console.error('Error deleting Instagram post:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting Instagram post:', error)
    return NextResponse.json(
      { error: 'Failed to delete Instagram post' },
      { status: 500 }
    )
  }
}
