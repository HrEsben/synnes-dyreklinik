import { createClient } from './client'
import { logger } from '@/lib/logger'

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
    logger.error('Error uploading image:', { error: error.message })
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
    logger.error('Error listing images:', { error: error.message })
    return []
  }

  return data
}

export async function deleteImage(path: string) {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    logger.error('Error deleting image:', { error: error.message })
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
