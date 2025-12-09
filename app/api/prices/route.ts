import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createPriceItemSchema, validateInput } from '@/lib/validations/api'

export async function GET() {
  const supabase = await createClient()
  
  const { data: prices, error } = await supabase
    .from('price_items')
    .select(`
      *,
      category:price_categories(*)
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(prices)
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
    const validation = validateInput(createPriceItemSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { category_id, name, description, price_from, price_to, price_note } = validation.data

    // Get the highest sort_order for this category
    const { data: maxOrder } = await supabase
      .from('price_items')
      .select('sort_order')
      .eq('category_id', category_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const newSortOrder = (maxOrder?.sort_order || 0) + 1

    const { data: priceItem, error } = await supabase
      .from('price_items')
      .insert({
        category_id,
        name,
        description,
        price_from,
        price_to,
        price_note,
        sort_order: newSortOrder,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(priceItem, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
