import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT - reorder price categories
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { orderedIds } = await request.json()
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 })
    }
    
    // Update sort_order for each category
    const updates = orderedIds.map((id: string, index: number) => 
      supabase
        .from('price_categories')
        .update({ sort_order: index + 1 })
        .eq('id', id)
    )
    
    await Promise.all(updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/price-categories/reorder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
