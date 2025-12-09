import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createPriceCategorySchema, validateInput } from '@/lib/validations/api'

export async function GET() {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('price_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(createPriceCategorySchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { name, slug, description } = validation.data

    // Get the highest sort_order
    const { data: maxOrder } = await supabase
      .from('price_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const newSortOrder = (maxOrder?.sort_order || 0) + 1

    const { data: category, error } = await supabase
      .from('price_categories')
      .insert({
        name,
        slug,
        description,
        sort_order: newSortOrder,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
