'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2, Edit2, GripVertical } from 'lucide-react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    caption: ''
  })

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
      alert('Kunne ikke hente Instagram posts')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      url: '',
      caption: ''
    })
    setEditingPost(null)
  }

  const handleCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (post: InstagramPost) => {
    setEditingPost(post)
    setFormData({
      url: post.url,
      caption: post.caption
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette dette Instagram opslag?')) return

    setLoading(true)

    try {
      const response = await fetch(`/api/instagram?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
      } else {
        alert('Fejl ved sletning af opslag')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Fejl ved sletning af opslag')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.url.trim()) {
      alert('Instagram URL skal udfyldes')
      return
    }

    setLoading(true)

    try {
      // Fetch Instagram data via oEmbed
      let thumbnailUrl = ''
      let instagramCaption = ''
      try {
        const oembedResponse = await fetch(`/api/instagram-oembed?url=${encodeURIComponent(formData.url)}`)
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json()
          console.log('oEmbed data:', oembedData)
          thumbnailUrl = oembedData.thumbnail_url || ''
          instagramCaption = oembedData.title || ''
          console.log('Extracted caption:', instagramCaption)
        } else {
          console.error('oEmbed fetch failed:', await oembedResponse.text())
        }
      } catch (err) {
        console.warn('Could not fetch Instagram data:', err)
      }

      // Extract post ID from URL or use existing
      let postId: string
      if (editingPost) {
        postId = editingPost.id
      } else {
        const postIdMatch = formData.url.match(/\/p\/([^\/\?]+)/)
        postId = postIdMatch ? postIdMatch[1] : `post-${Date.now()}`
      }

      const postData = {
        id: postId,
        url: formData.url.trim(),
        image_url: thumbnailUrl,
        caption: formData.caption.trim() || instagramCaption,
        display_order: editingPost ? editingPost.display_order : 1,
        is_active: true
      }

      // If creating a new post, update all existing posts' display_order
      if (!editingPost) {
        const updatedPosts = posts.map(post => ({
          ...post,
          display_order: post.display_order + 1
        }))

        const response = await fetch('/api/instagram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ posts: [postData, ...updatedPosts] }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to save post')
        }
      } else {
        const response = await fetch('/api/instagram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ posts: [postData] }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to save post')
        }
      }

      await fetchPosts()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving Instagram post:', error)
      const errorMessage = error instanceof Error ? error.message : 'Kunne ikke gemme Instagram opslag'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = posts.findIndex(post => post.id === id)
    if (currentIndex === -1) return

    const newPosts = [...posts]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newPosts.length) return

    // Swap items
    ;[newPosts[currentIndex], newPosts[targetIndex]] = [newPosts[targetIndex], newPosts[currentIndex]]
    
    // Update display_order for all items
    const updatedPosts = newPosts.map((post, index) => ({
      ...post,
      display_order: index + 1
    }))

    setPosts(updatedPosts)

    // Update order in database
    try {
      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts: updatedPosts }),
      })

      if (!response.ok) {
        // Revert on error
        setPosts(posts)
        alert('Fejl ved opdatering af rækkefølge')
      }
    } catch (error) {
      console.error('Error reordering posts:', error)
      // Revert on error
      setPosts(posts)
      alert('Fejl ved opdatering af rækkefølge')
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            Administrer Instagram posts på forsiden
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#f97561] hover:bg-[#e86850]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tilføj opslag
        </Button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div 
            key={post.id} 
            className={`flex items-center gap-4 p-4 rounded-lg hover:bg-opacity-80 transition-colors ${
              index < 6 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveItem(post.id, 'up')}
                disabled={index === 0 || loading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed w-6 h-6 flex items-center justify-center"
                title="Flyt op"
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(post.id, 'down')}
                disabled={index === posts.length - 1 || loading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed w-6 h-6 flex items-center justify-center"
                title="Flyt ned"
              >
                ↓
              </button>
            </div>

            <div className="flex items-center text-gray-400">
              <GripVertical className="h-5 w-5" />
              {index < 6 && (
                <span className="text-xs ml-1">#{index + 1}</span>
              )}
            </div>

            {post.image_url && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                <Image
                  src={post.image_url}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {post.caption || 'Ingen billedtekst'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {post.url}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(post)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleDelete(post.id)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Ingen Instagram opslag endnu</p>
            <p className="text-sm mt-2">Klik på &quot;Tilføj opslag&quot; for at komme i gang</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#2c2524'
              }}>
                {editingPost ? 'Rediger Instagram opslag' : 'Tilføj Instagram opslag'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-2">
                    Instagram URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none"
                    placeholder="https://www.instagram.com/p/ABC123/"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Billedet og billedteksten hentes automatisk fra Instagram
                  </p>
                </div>

                <div>
                  <label htmlFor="caption" className="block text-sm font-medium mb-2">
                    Billedtekst (valgfri)
                  </label>
                  <textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none resize-y"
                    placeholder="Skriv en kort billedtekst..."
                    rows={2}
                    style={{ minHeight: '60px' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lad tom for at bruge billedteksten fra Instagram. Eller skriv din egen.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#f97561] hover:bg-[#e86850]" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gemmer...
                      </>
                    ) : (
                      editingPost ? 'Gem ændringer' : 'Tilføj opslag'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Annuller
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
