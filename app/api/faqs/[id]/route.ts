import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateFaqSchema, validateInput } from '@/lib/validations/api'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const params = await context.params
    const faqId = parseInt(params.id)
    
    // Validate input
    const validation = validateInput(updateFaqSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { question, answer } = validation.data

    const { data: updatedFaq, error } = await supabase
      .from('faqs')
      .update({
        question,
        answer
      })
      .eq('id', faqId)
      .select()
      .single()

    if (error) {
      console.error('Error updating FAQ:', error)
      return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
    }

    return NextResponse.json({ faq: updatedFaq })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const faqId = parseInt(params.id)

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faqId)

    if (error) {
      console.error('Error deleting FAQ:', error)
      return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
