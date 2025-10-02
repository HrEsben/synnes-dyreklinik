'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, getImageUrl} from '@/lib/supabase/storage'
import { Upload, Loader2, FolderOpen, Play, X, Video, Edit, Save, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSiteImage } from '@/hooks/use-site-image'
import MediaBrowser from '@/components/media-browser'

interface EditableVideoProps {
  videoKey: string // Key for storing video URL in database
  thumbnailKey: string
  videoUrl: string // URL to the video (YouTube, Vimeo, local file, etc.)
  fallbackThumbnail: string
  alt: string
  width: number
  height: number
  className?: string
  style?: React.CSSProperties
  containerClassName?: string
  isAuthenticated?: boolean
  editable?: boolean
  priority?: boolean
  fetchPriority?: "high" | "low" | "auto"
}

export default function EditableVideo({
  videoKey,
  thumbnailKey,
  videoUrl,
  fallbackThumbnail,
  alt,
  width,
  height,
  className,
  style,
  containerClassName,
  isAuthenticated = false,
  editable = true,
  priority,
  fetchPriority
}: EditableVideoProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showMediaBrowser, setShowMediaBrowser] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isEditingVideoUrl, setIsEditingVideoUrl] = useState(false)
  const [editedVideoUrl, setEditedVideoUrl] = useState(videoUrl)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl)
  const [isSavingVideoUrl, setIsSavingVideoUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const supabase = createClient()

  // Use the site image hook for the thumbnail
  const { imageUrl: thumbnailUrl, loading } = useSiteImage(thumbnailKey, fallbackThumbnail)

  // Fetch video URL from database when component mounts
  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (isAuthenticated && videoKey) {
        try {
          const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('content_key', videoKey)
            .single()

          if (data && !error) {
            setCurrentVideoUrl(data.content)
            setEditedVideoUrl(data.content)
          }
        } catch (error) {
          console.error('Error fetching video URL:', error)
        }
      }
    }

    fetchVideoUrl()
  }, [videoKey, isAuthenticated, supabase])

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      // Restore scrolling if component unmounts while video is playing
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    try {
      setIsConverting(true)
      let convertedFile = file

      // Convert HEIC/HEIF to JPEG if needed
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().includes('.heic') || file.name.toLowerCase().includes('.heif')) {
        // Import heic2any dynamically
        const heic2any = (await import('heic2any')).default
        
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        }) as Blob

        convertedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        })
      }

      setIsConverting(false)

      // Automatically upload the thumbnail
      await handleUpload(convertedFile)
    } catch (error) {
      console.error('File conversion error:', error)
      console.error('Conversion error:', error instanceof Error ? error.message : 'Fejl ved konvertering af fil')
      setIsConverting(false)
    }
  }

  const handleUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedFile
    if (!file) return

    setIsUploading(true)
    try {
      // Create filename based on thumbnailKey
      const fileExt = file.name.split('.').pop()
      const fileName = `public/images/${thumbnailKey}-${Date.now()}.${fileExt}`
      
      const uploadResult = await uploadImage(file, fileName)
      if (!uploadResult) {
        throw new Error('Failed to upload thumbnail')
      }

      const newImageUrl = getImageUrl(fileName)
      
      // Update the thumbnail in database
      const { data: updateData, error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: newImageUrl,
          alt_text: alt
        })
        .eq('image_key', thumbnailKey)
        .select()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update thumbnail in database')
      }

      // If no rows were updated, insert new record
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            image_key: thumbnailKey,
            image_url: newImageUrl,
            alt_text: alt
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error('Failed to insert thumbnail in database')
        }
      }

      // Clear file selection
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error)
      console.error('Thumbnail upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleMediaSelection = async (mediaUrl: string) => {
    try {
      // Update the thumbnail in database
      const { data: updateData, error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: mediaUrl,
          alt_text: alt
        })
        .eq('image_key', thumbnailKey)
        .select()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update thumbnail in database')
      }

      // If no rows were updated, insert new record
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            image_key: thumbnailKey,
            image_url: mediaUrl,
            alt_text: alt
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error('Failed to insert thumbnail in database')
        }
      }

      setShowMediaBrowser(false)
    } catch (error) {
      console.error('Error selecting media:', error)
      console.error('Thumbnail selection error:', error)
    }
  }

  const handlePlayVideo = () => {
    setIsVideoPlaying(true)
    // Lock scrolling
    document.body.style.overflow = 'hidden'
  }

  const handleCloseVideo = () => {
    setIsVideoPlaying(false)
    // Unlock scrolling
    document.body.style.overflow = 'unset'
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleSaveVideoUrl = async () => {
    if (!editedVideoUrl.trim()) return

    setIsSavingVideoUrl(true)
    try {
      // Update the video URL in database
      const { data: updateData, error: updateError } = await supabase
        .from('site_content')
        .update({
          content: editedVideoUrl.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('content_key', videoKey)
        .select()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update video URL in database')
      }

      // If no rows were updated, insert new record
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('site_content')
          .insert({
            content_key: videoKey,
            content: editedVideoUrl.trim()
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error('Failed to insert video URL in database')
        }
      }

      setCurrentVideoUrl(editedVideoUrl.trim())
      setIsEditingVideoUrl(false)
    } catch (error) {
      console.error('Error saving video URL:', error)
      alert('Fejl ved gemning af video URL')
    } finally {
      setIsSavingVideoUrl(false)
    }
  }

  const handleCancelVideoUrlEdit = () => {
    setEditedVideoUrl(currentVideoUrl)
    setIsEditingVideoUrl(false)
  }

  const displayThumbnail = previewUrl || thumbnailUrl

  if (loading) {
    return (
      <div className={`${containerClassName} animate-pulse bg-gray-200`} style={{ width, height }}>
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    )
  }

  // For non-authenticated users, show the video thumbnail with play button
  if (!isAuthenticated || !editable) {
    return (
      <div className={`relative ${containerClassName} cursor-pointer group`} onClick={handlePlayVideo}>
        <Image
          src={displayThumbnail}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          priority={priority}
          fetchPriority={fetchPriority}
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-[#f97561] bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-200 group-hover:scale-110">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>

        {/* Video modal */}
        {isVideoPlaying && (
          <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} onClick={handleCloseVideo}>
            <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={handleCloseVideo}
                className="absolute -top-12 right-0 bg-white hover:bg-accent text-accent-foreground hover:text-white border-0 shadow-lg transition-all duration-200 hover:scale-110 rounded-full w-10 h-10 p-0"
                size="sm"
              >
                <X size={20} />
              </Button>
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                {currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be') ? (
                  <iframe
                    src={currentVideoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : currentVideoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={currentVideoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={currentVideoUrl}
                    className="w-full h-full rounded-lg"
                    controls
                    autoPlay
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // For authenticated users in edit mode
  return (
    <div className={`relative group ${containerClassName}`}>
      {displayThumbnail !== fallbackThumbnail ? (
        <div className="relative cursor-pointer" onClick={handlePlayVideo}>
          <Image
            src={displayThumbnail}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
            priority={priority}
            fetchPriority={fetchPriority}
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#f97561] bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-200 group-hover:scale-110">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
          
          {/* Edit overlay for authenticated users */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
            >
              <Upload size={16} className="mr-2" />
              Upload thumbnail
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowMediaBrowser(true)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
            >
              <FolderOpen size={16} className="mr-2" />
              Vælg thumbnail
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingVideoUrl(true)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
            >
              <Edit size={16} className="mr-2" />
              Rediger video URL
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-lg"
          style={{ width, height }}
        >
          <div className="text-center">
            <Video size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500 mb-4">Ingen video thumbnail valgt</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black hover:bg-accent hover:text-white"
              >
                <Upload size={16} className="mr-2" />
                Upload thumbnail
              </Button>
              <Button
                size="sm"
                onClick={() => setShowMediaBrowser(true)}
                className="bg-white text-black hover:bg-accent hover:text-white"
              >
                <FolderOpen size={16} className="mr-2" />
                Vælg thumbnail
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Media Browser Modal */}
      {showMediaBrowser && (
        <MediaBrowser
          isOpen={showMediaBrowser}
          onClose={() => setShowMediaBrowser(false)}
          onSelect={handleMediaSelection}
        />
      )}

      {/* Upload progress overlay */}
      {(isUploading || isConverting) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 text-center">
            <Loader2 size={32} className="mx-auto mb-2 animate-spin" />
            <p className="text-sm">
              {isConverting ? 'Konverterer billede...' : 'Uploader thumbnail...'}
            </p>
          </div>
        </div>
      )}

      {/* Video URL editing modal */}
      {isEditingVideoUrl && (
        <div className="fixed inset-0 flex items-center justify-center z-[80]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} onClick={handleCancelVideoUrlEdit}>
          <div className="bg-white rounded-lg p-6 mx-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Rediger Video URL</h3>
            <div className="mb-4">
              <label htmlFor="video-url" className="block text-sm font-medium mb-2">
                Video URL (YouTube, Vimeo, eller direkte video link)
              </label>
              <Input
                id="video-url"
                type="url"
                value={editedVideoUrl}
                onChange={(e) => setEditedVideoUrl(e.target.value)}
                placeholder="https://youtu.be/... eller https://vimeo.com/..."
                className="w-full"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelVideoUrlEdit}
                disabled={isSavingVideoUrl}
              >
                <XCircle size={16} className="mr-2" />
                Annuller
              </Button>
              <Button
                onClick={handleSaveVideoUrl}
                disabled={isSavingVideoUrl || !editedVideoUrl.trim()}
              >
                {isSavingVideoUrl ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Gemmer...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Gem
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video modal for authenticated users */}
      {isVideoPlaying && (
        <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }} onClick={handleCloseVideo}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 bg-white hover:bg-accent text-accent-foreground hover:text-white border-0 shadow-lg transition-all duration-200 hover:scale-110 rounded-full w-10 h-10 p-0"
              size="sm"
            >
              <X size={20} />
            </Button>
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              {currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={currentVideoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onClick={(e) => e.stopPropagation()}
                />
              ) : currentVideoUrl.includes('vimeo.com') ? (
                <iframe
                  src={currentVideoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  className="w-full h-full rounded-lg"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  className="w-full h-full rounded-lg"
                  controls
                  autoPlay
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}