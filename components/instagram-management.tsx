'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, Plus, Trash2, Save, RefreshCw, GripVertical } from 'lucide-react'
import { useAlert } from '@/components/alert-context'
import Image from 'next/image'

interface InstagramPost {
  id: string
  url: string
  image_url: string
  caption: string
  display_order: number
  is_active: boolean
}

export default function InstagramManagement() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { showAlert } = useAlert()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/instagram')
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching Instagram posts:', error)
      showAlert('Kunne ikke hente Instagram posts', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPost = () => {
    const newPost: InstagramPost = {
      id: `new-${Date.now()}`,
      url: '',
      image_url: '',
      caption: '',
      display_order: posts.length + 1,
      is_active: true
    }
    setPosts([...posts, newPost])
  }

  const handleUpdatePost = (index: number, field: keyof InstagramPost, value: string | number | boolean) => {
    const updatedPosts = [...posts]
    updatedPosts[index] = { ...updatedPosts[index], [field]: value }
    setPosts(updatedPosts)
  }

  const handleDeletePost = (index: number) => {
    const updatedPosts = posts.filter((_, i) => i !== index)
    // Update display_order for remaining posts
    const reorderedPosts = updatedPosts.map((post, i) => ({
      ...post,
      display_order: i + 1
    }))
    setPosts(reorderedPosts)
  }

  const handleSavePosts = async () => {
    try {
      setIsSaving(true)
      
      // Validate posts
      for (const post of posts) {
        if (!post.id || !post.url || !post.image_url) {
          showAlert('Alle posts skal have ID, URL og billede-URL', 'error')
          return
        }
      }

      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts }),
      })

      if (!response.ok) {
        throw new Error('Failed to save posts')
      }

      showAlert('Instagram posts opdateret!', 'success')
      await fetchPosts() // Refresh to get latest data
    } catch (error) {
      console.error('Error saving Instagram posts:', error)
      showAlert('Kunne ikke gemme Instagram posts', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const extractInstagramId = (url: string): string => {
    // Extract Instagram post ID from URL
    // Example: https://www.instagram.com/p/ABC123/ -> ABC123
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/)
    return match ? match[1] : ''
  }

  const handleUrlChange = (index: number, url: string) => {
    handleUpdatePost(index, 'url', url)
    // Auto-extract ID if it's a valid Instagram URL
    const postId = extractInstagramId(url)
    if (postId && posts[index].id.startsWith('new-')) {
      handleUpdatePost(index, 'id', postId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Instagram Feed</h3>
          <p className="text-sm text-gray-600">
            Administrer Instagram posts der vises på hjemmesiden
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchPosts}
            variant="outline"
            size="sm"
            disabled={isSaving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Opdater
          </Button>
          <Button
            onClick={handleAddPost}
            variant="outline"
            size="sm"
            disabled={isSaving}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tilføj post
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card key={post.id} className="p-4">
            <div className="flex gap-4">
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>

              {post.image_url && (
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={post.image_url}
                    alt={post.caption || 'Instagram post'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Instagram URL
                    </label>
                    <Input
                      value={post.url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://www.instagram.com/p/..."
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Post ID
                    </label>
                    <Input
                      value={post.id}
                      onChange={(e) => handleUpdatePost(index, 'id', e.target.value)}
                      placeholder="ABC123"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Billede URL
                  </label>
                  <Input
                    value={post.image_url}
                    onChange={(e) => handleUpdatePost(index, 'image_url', e.target.value)}
                    placeholder="https://..."
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Caption
                  </label>
                  <Textarea
                    value={post.caption}
                    onChange={(e) => handleUpdatePost(index, 'caption', e.target.value)}
                    placeholder="Skriv en billedtekst..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  onClick={() => handleDeletePost(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="text-xs text-gray-500">#{post.display_order}</div>
              </div>
            </div>
          </Card>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Ingen Instagram posts endnu</p>
            <p className="text-sm mt-2">Klik på &quot;Tilføj post&quot; for at komme i gang</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSavePosts}
          disabled={isSaving || posts.length === 0}
          className="min-w-[150px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gemmer...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Gem ændringer
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
