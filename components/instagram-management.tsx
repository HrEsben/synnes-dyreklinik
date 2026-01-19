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
    id: '',
    url: '',
    image_url: '',
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
      id: '',
      url: '',
      image_url: '',
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
      id: post.id,
      url: post.url,
      image_url: post.image_url,
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

  const extractInstagramId = (url: string): string => {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/)
    return match ? match[1] : ''
  }

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }))
    
    // Auto-extract ID if it's a valid Instagram URL and we're creating a new post
    const postId = extractInstagramId(url)
    if (postId && !editingPost) {
      setFormData(prev => ({ ...prev, id: postId }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.id.trim() || !formData.url.trim() || !formData.image_url.trim()) {
      alert('ID, URL og Billede URL skal udfyldes')
      return
    }

    setLoading(true)

    try {
      const postData = {
        id: formData.id.trim(),
        url: formData.url.trim(),
        image_url: formData.image_url.trim(),
        caption: formData.caption.trim(),
        display_order: editingPost ? editingPost.display_order : posts.length + 1,
        is_active: true
      }

      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts: [postData] }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      await fetchPosts() // Refresh the list
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving Instagram post:', error)
      alert('Kunne ikke gemme Instagram opslag')
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
            {posts.length} {posts.length === 1 ? 'opslag' : 'opslag'} i alt
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
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
              <span className="text-xs ml-1">#{post.display_order}</span>
            </div>

            {post.image_url && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                <Image
                  src={post.image_url}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {post.caption || 'Ingen caption'}
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
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none"
                    placeholder="https://www.instagram.com/p/ABC123/"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Post ID udtrækkes automatisk fra URL&apos;en
                  </p>
                </div>

                <div>
                  <label htmlFor="id" className="block text-sm font-medium mb-2">
                    Post ID *
                  </label>
                  <input
                    type="text"
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none"
                    placeholder="ABC123"
                    required
                    disabled={!!editingPost}
                  />
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium mb-2">
                    Billede URL *
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none"
                    placeholder="https://..."
                    required
                  />
                  {formData.image_url && (
                    <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="caption" className="block text-sm font-medium mb-2">
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none resize-y"
                    placeholder="Skriv en billedtekst..."
                    rows={3}
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#f97561] hover:bg-[#e86850]" 
                    disabled={loading}
                  >
                    {loading ? 'Gemmer...' : (editingPost ? 'Gem ændringer' : 'Tilføj opslag')}
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
