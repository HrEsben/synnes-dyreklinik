import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createFaqSchema, validateInput } from '@/lib/validations/api'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching FAQs:', error)
      return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
    }

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validation = validateInput(createFaqSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { question, answer } = validation.data

    // Get the next display order
    const { data: maxOrderData } = await supabase
      .from('faqs')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.display_order || 0) + 1

    const { data: newFaq, error } = await supabase
      .from('faqs')
      .insert([{
        question,
        answer,
        display_order: nextOrder
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating FAQ:', error)
      return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
    }

    return NextResponse.json({ faq: newFaq }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
