import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET single category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/service-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - update category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    // First, get the current category to check if slug is changing
    const { data: currentCategory } = await supabase
      .from('service_categories')
      .select('slug')
      .eq('id', id)
      .single()
    
    if (!currentCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    const slugChanged = currentCategory.slug !== body.slug
    
    // Update the category
    const { data, error } = await supabase
      .from('service_categories')
      .update({
        slug: body.slug,
        label: body.label,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // If slug changed, update all services that reference this category
    if (slugChanged) {
      const { error: servicesError } = await supabase
        .from('services')
        .update({ category: body.slug })
        .eq('category', currentCategory.slug)
      
      if (servicesError) {
        console.error('Error updating services category:', servicesError)
        // Note: The category is already updated, so we just log the error
        // but still return success for the category update
      }
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/service-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // First check if any services use this category
    const { data: category } = await supabase
      .from('service_categories')
      .select('slug')
      .eq('id', id)
      .single()
    
    if (category) {
      const { data: services } = await supabase
        .from('services')
        .select('id')
        .eq('category', category.slug)
        .limit(1)
      
      if (services && services.length > 0) {
        return NextResponse.json(
          { error: 'Kan ikke slette kategorien, da den bruges af en eller flere ydelser.' },
          { status: 400 }
        )
      }
    }
    
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/service-categories/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
