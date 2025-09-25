'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SiteImage {
  id: number
  image_key: string
  image_url: string
  alt_text: string | null
  created_at: string
  updated_at: string
}

export function useSiteImage(imageKey: string, fallbackUrl: string) {
  const [imageUrl, setImageUrl] = useState(fallbackUrl)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchImage() {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('image_key', imageKey)
          .single()

        if (error) {
          setImageUrl(fallbackUrl)
        } else {
          setImageUrl(data.image_url)
        }
      } catch (error) {
        console.error('Error fetching image:', error)
        setImageUrl(fallbackUrl)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('site_images_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'site_images',
          filter: `image_key=eq.${imageKey}`
        }, 
        (payload) => {
          if (payload.new && 'image_url' in payload.new) {
            setImageUrl((payload.new as SiteImage).image_url)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [imageKey, fallbackUrl, supabase])

  return { imageUrl, loading }
}
