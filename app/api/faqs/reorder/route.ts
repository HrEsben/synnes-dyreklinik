import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { faqs } = await request.json()

    if (!faqs || !Array.isArray(faqs)) {
      return NextResponse.json({ error: 'Invalid FAQs data' }, { status: 400 })
    }

    // Update display order for all FAQs
    const updates = faqs.map((faq, index) => 
      supabase
        .from('faqs')
        .update({ display_order: index + 1 })
        .eq('id', faq.id)
    )

    const results = await Promise.all(updates)
    
    // Check if any updates failed
    const errors = results.filter(result => result.error)
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
