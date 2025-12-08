import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PUT - reorder categories
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { orderedIds } = await request.json()
    
    // Update sort_order for each category
    const updates = orderedIds.map((id: string, index: number) => 
      supabase
        .from('service_categories')
        .update({ sort_order: index + 1 })
        .eq('id', id)
    )
    
    await Promise.all(updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/service-categories/reorder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
