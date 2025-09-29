import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items data' }, { status: 400 })
    }

    // Update display order for all FAQs
    const updates = items.map((item: { id: number, display_order: number }) => 
      supabase
        .from('faqs')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    
    // Check if any updates failed
    const errors = results.filter((result: any) => result.error)
    if (errors.length > 0) {
      console.error('Error updating FAQ order:', errors)
      return NextResponse.json({ error: 'Failed to update FAQ order' }, { status: 500 })
    }

    return NextResponse.json({ message: 'FAQ order updated successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
