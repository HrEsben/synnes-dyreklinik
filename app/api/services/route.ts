import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceSchema, validateInput } from '@/lib/validations/api'

export async function GET() {
  const supabase = await createClient()
  
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(services)
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
    const validation = validateInput(createServiceSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const { slug, title, content, icon, category, image_key } = validation.data

    // Get the highest sort_order
    const { data: maxOrder } = await supabase
      .from('services')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const newSortOrder = (maxOrder?.sort_order || 0) + 1

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        slug,
        title,
        content,
        icon,
        category,
        sort_order: newSortOrder,
        image_key
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
