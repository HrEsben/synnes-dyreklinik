import { createClient } from './client'

const supabase = createClient()

export const BUCKET_NAME = 'media'

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  return data
}

export function getImageUrl(path: string) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)

  return data.publicUrl
}

export async function listImages() {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list()

  if (error) {
    console.error('Error listing images:', error)
    return []
  }

  return data
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Error deleting image:', error)
    return false
  }

  return true
}

// Helper function to extract file path from URL
export function getPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

// Helper function to get optimized image URL with transformations
export function getOptimizedImageUrl(path: string, options?: {
  width?: number
  height?: number
  quality?: number
}) {
  const baseUrl = getImageUrl(path)
  
  if (!options) return baseUrl
  
  const params = new URLSearchParams()
  if (options.width) params.append('width', options.width.toString())
  if (options.height) params.append('height', options.height.toString())
  if (options.quality) params.append('quality', options.quality.toString())
  
  return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`
}
