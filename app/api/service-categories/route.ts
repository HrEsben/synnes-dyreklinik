import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCategorySchema, validateInput } from '@/lib/validations/api'

// GET all categories
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/service-categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - create new category (requires authentication)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(createCategorySchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { slug, label } = validation.data
    
    // Get max sort_order
    const { data: maxData } = await supabase
      .from('service_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
    
    const nextOrder = (maxData?.[0]?.sort_order ?? 0) + 1
    
    const { data, error } = await supabase
      .from('service_categories')
      .insert([{
        slug,
        label,
        sort_order: nextOrder
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/service-categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
