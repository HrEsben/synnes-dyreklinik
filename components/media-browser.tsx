'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getImageUrl } from '@/lib/supabase/storage'
import { X, Search, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaBrowserProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imagePath: string) => void
}

interface StorageItem {
  name: string
  id: string | null
  updated_at: string | null
  created_at: string | null
  last_accessed_at: string | null
  metadata: Record<string, unknown> | null
}

export default function MediaBrowser({ isOpen, onClose, onSelect }: MediaBrowserProps) {
  const [images, setImages] = useState<StorageItem[]>([])
  const [folders, setFolders] = useState<StorageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentFolder, setCurrentFolder] = useState('public')
  const [searchTerm, setSearchTerm] = useState('')
  const [folderPath, setFolderPath] = useState(['public'])
  const supabase = createClient()

  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage
        .from('media')
        .list(currentFolder, {
          limit: 100,
          offset: 0,
        })

      if (error) {
        console.error('Error loading images:', error)
        return
      }

      if (data) {
        // Separate folders and images
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
        const folderItems = data.filter(item => item.id === null) // Folders have null id
        const imageItems = data.filter(item => {
          if (item.id === null) return false
          const extension = item.name.split('.').pop()?.toLowerCase()
          return extension && imageExtensions.includes(extension)
        })

        setFolders(folderItems)
        setImages(imageItems)
      }
    } catch (error) {
      console.error('Error loading images:', error)
    }
    setLoading(false)
  }, [currentFolder, supabase])

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen, currentFolder, loadImages])

  const navigateToFolder = (folderName: string) => {
    const newPath = [...folderPath, folderName]
    setFolderPath(newPath)
    setCurrentFolder(newPath.join('/'))
  }

  const navigateBack = () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1)
      setFolderPath(newPath)
      setCurrentFolder(newPath.join('/'))
    }
  }

  const handleImageSelect = (imageName: string) => {
    const fullPath = `${currentFolder}/${imageName}`
    onSelect(fullPath)
    onClose()
  }

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Vælg billede</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateBack}
              disabled={folderPath.length <= 1}
            >
              ← Back
            </Button>
            <span className="text-sm text-gray-600">
              {folderPath.join(' / ')}
            </span>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97561]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {/* Folders */}
              {filteredFolders.map((folder) => (
                <div
                  key={folder.name}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigateToFolder(folder.name)}
                >
                  <div className="flex flex-col items-center">
                    <Folder className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs text-center truncate w-full">{folder.name}</span>
                  </div>
                </div>
              ))}

              {/* Images */}
              {filteredImages.map((image) => (
                <div
                  key={image.name}
                  className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleImageSelect(image.name)}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={getImageUrl(`${currentFolder}/${image.name}`)}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                  </div>
                  <div className="p-2">
                    <span className="text-xs truncate block">{image.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredImages.length === 0 && filteredFolders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No images found in this folder
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{filteredImages.length} images, {filteredFolders.length} folders</span>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}