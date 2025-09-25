'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  const [currentFolder, setCurrentFolder] = useState('images/image-browser')
  const [searchTerm, setSearchTerm] = useState('')
  const [folderPath, setFolderPath] = useState(['images', 'image-browser'])
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const supabase = createClient()

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus management and keyboard event handling
  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Focus the dialog when it opens
    const focusDialog = () => {
      if (dialogRef.current) {
        dialogRef.current.focus()
      }
    }

    // Small delay to ensure the dialog is rendered
    const timeoutId = setTimeout(focusDialog, 10)

    // Handle keyboard events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }

      // Trap focus within the dialog
      if (event.key === 'Tab') {
        trapFocus(event)
      }
    }

    // Trap focus within the dialog
    const trapFocus = (event: KeyboardEvent) => {
      if (!dialogRef.current) return

      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('keydown', handleKeyDown)
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose])

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
    if (folderPath.length > 2) { // Changed from 1 to 2 to keep at least ['images', 'image-browser']
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

  if (!isOpen || !mounted) return null

  const dialogContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg max-w-6xl w-full max-h-[85vh] flex flex-col shadow-2xl transform-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 id="dialog-title" className="text-2xl font-semibold">Vælg billede</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            aria-label="Luk dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateBack}
              disabled={folderPath.length <= 2} // Changed from 1 to 2
            >
              ← Back
            </Button>
            <span className="text-sm text-gray-600">
              {folderPath.join(' / ')}
            </span>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              aria-label="Søg efter billeder"
            />
          </div>
        </div>

        {/* Content */}
        <div 
          id="dialog-description" 
          className="flex-1 p-6 overflow-y-auto"
          role="main"
          aria-label="Billede browser indhold"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97561]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {/* Folders */}
              {filteredFolders.map((folder) => (
                <button
                  key={folder.name}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors text-left"
                  onClick={() => navigateToFolder(folder.name)}
                  aria-label={`Åbn mappe ${folder.name}`}
                >
                  <div className="flex flex-col items-center">
                    <Folder className="w-12 h-12 text-blue-500 mb-3" aria-hidden="true" />
                    <span className="text-sm text-center truncate w-full font-medium">{folder.name}</span>
                  </div>
                </button>
              ))}

              {/* Images */}
              {filteredImages.map((image) => (
                <button
                  key={image.name}
                  className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow transform-none text-left"
                  onClick={() => handleImageSelect(image.name)}
                  aria-label={`Vælg billede ${image.name}`}
                >
                  <div className="aspect-[4/3] relative bg-gray-100">
                    <Image
                      src={getImageUrl(`${currentFolder}/${image.name}`)}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-sm truncate block font-medium">{image.name}</span>
                  </div>
                </button>
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
            <Button variant="outline" onClick={onClose} aria-label="Annuller og luk dialog">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}