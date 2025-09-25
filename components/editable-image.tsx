'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, getImageUrl, deleteImage, getPathFromUrl } from '@/lib/supabase/storage'
import { Upload, Loader2, ImageIcon, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteImage } from '@/hooks/use-site-image'
import MediaBrowser from '@/components/media-browser'

interface EditableImageProps {
  imageKey: string
  fallbackSrc: string
  alt: string
  width: number
  height: number
  className?: string
  style?: React.CSSProperties
  containerClassName?: string
  isAuthenticated?: boolean
  editable?: boolean // New prop to control if image can be edited
  priority?: boolean // For LCP optimization
  fetchPriority?: "high" | "low" | "auto" // For fetch priority
}

export default function EditableImage({
  imageKey,
  fallbackSrc,
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
}: EditableImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showMediaBrowser, setShowMediaBrowser] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use the basic site image hook
  const { imageUrl, loading } = useSiteImage(imageKey, fallbackSrc);

  const supabase = createClient()

  // Convert HEIC/HEIF files to JPEG
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (!file.type.includes('heic') && !file.type.includes('heif') && !file.name.toLowerCase().includes('.heic')) {
      return file // Return original if not HEIC
    }

    try {
      setIsConverting(true)
      
      // Dynamic import to avoid SSR issues
      const heic2any = (await import('heic2any')).default
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      }) as Blob

      // Create new File object from converted blob
      const convertedFile = new File(
        [convertedBlob],
        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
        { type: 'image/jpeg' }
      )

      return convertedFile
    } catch (error) {
      console.error('Error converting HEIC file:', error)
      throw new Error('Kunne ikke konvertere HEIC fil. Prøv at gemme som JPEG først.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Convert HEIC to JPEG if needed
      const convertedFile = await convertHeicToJpeg(file)
      setSelectedFile(convertedFile)
      
      // Create preview URL
      const preview = URL.createObjectURL(convertedFile)
      setPreviewUrl(preview)

      // Automatically upload the file
      await handleUpload(convertedFile)
    } catch (error) {
      console.error('File conversion error:', error)
      console.error('Conversion error:', error instanceof Error ? error.message : 'Fejl ved konvertering af fil')
    }
  }

  const handleUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedFile
    if (!file) return

    setIsUploading(true)
    try {
      // Create filename based on imageKey
      const fileExt = file.name.split('.').pop()
      const fileName = `public/images/${imageKey}-${Date.now()}.${fileExt}`
      
      const uploadResult = await uploadImage(file, fileName)
      if (!uploadResult) {
        throw new Error('Failed to upload image')
      }

      const newImageUrl = getImageUrl(fileName)
      
      // Update the image in database (site_images table)
      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: newImageUrl,
          alt_text: alt
        })
        .eq('image_key', imageKey)
        .select()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update image in database')
      }

      // If no rows were updated, insert new record
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            image_key: imageKey,
            image_url: newImageUrl,
            alt_text: alt
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error('Failed to insert image in database')
        }
      }

      // Clean up old image if it exists and is different
      if (imageUrl !== fallbackSrc && imageUrl.includes('supabase.co')) {
        const oldImagePath = getPathFromUrl(imageUrl)
        if (oldImagePath) {
          await deleteImage(oldImagePath)
        }
      }

      // The useSiteImage hook will automatically update with the new URL
      setSelectedFile(null)
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleMediaSelection = async (imagePath: string) => {
    try {
      const supabase = createClient()
      const newImageUrl = getImageUrl(imagePath)
      
      // Update the image in database (site_images table)
      const { data: updateData, error: updateError } = await supabase
        .from('site_images')
        .update({
          image_url: newImageUrl,
          alt_text: alt
        })
        .eq('image_key', imageKey)
        .select()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update image in database')
      }

      // If no rows were updated, insert new record
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('site_images')
          .insert({
            image_key: imageKey,
            image_url: newImageUrl,
            alt_text: alt
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error('Failed to insert image in database')
        }
      }

      setShowMediaBrowser(false)
    } catch (error) {
      console.error('Error selecting media:', error)
      console.error('Image selection error:', error)
    }
  }

  const displaySrc = previewUrl || imageUrl

  if (loading) {
    return (
      <div className={`${containerClassName} animate-pulse bg-gray-200`} style={{ width, height }}>
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    )
  }

  if (!isAuthenticated || !editable) {
    // For non-authenticated users, only show the image if it's not the fallback/placeholder
    if (imageUrl === fallbackSrc) {
      return null // Don't render anything if it's just the placeholder
    }
    
    return (
      <div className={containerClassName}>
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          priority={priority}
          fetchPriority={fetchPriority}
        />
      </div>
    )
  }

  return (
    <div className={`relative group ${containerClassName}`}>
      {displaySrc !== fallbackSrc ? (
        <>
          <Image
            src={displaySrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
            priority={priority}
            fetchPriority={fetchPriority}
          />
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
            >
              <Upload size={16} className="mr-2" />
              Upload
            </Button>
            <Button
              size="sm"
              onClick={() => setShowMediaBrowser(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
            >
              <FolderOpen size={16} className="mr-2" />
              Gennemse
            </Button>
          </div>
        </>
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors rounded-lg"
          style={{ width, height }}
        >
          <div className="text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500 mb-4">Intet billede valgt</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black hover:bg-accent hover:text-white"
              >
                <Upload size={16} className="mr-2" />
                Upload
              </Button>
              <Button
                size="sm"
                onClick={() => setShowMediaBrowser(true)}
                className="bg-white text-black hover:bg-accent hover:text-white"
              >
                <FolderOpen size={16} className="mr-2" />
                Gennemse
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input that opens directly */}
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
              {isConverting ? 'Konverterer billede...' : 'Uploader billede...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
