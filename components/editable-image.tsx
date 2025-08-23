'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, getImageUrl, deleteImage, getPathFromUrl } from '@/lib/supabase/storage'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteImage } from '@/hooks/use-site-image'

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
}

export default function EditableImage({
  imageKey,
  fallbackSrc,
  alt,
  width,
  height,
  className = '',
  style = {},
  containerClassName = '',
  isAuthenticated = false,
  editable = true // Default to true for backwards compatibility
}: EditableImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  
  // Use the hook to get current image URL
  const { imageUrl, loading } = useSiteImage(imageKey, fallbackSrc)

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
      alert(error instanceof Error ? error.message : 'Fejl ved konvertering af fil')
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
      
      alert('Billede opdateret!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Fejl ved upload af billede')
    } finally {
      setIsUploading(false)
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
    return (
      <div className={containerClassName}>
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
        />
      </div>
    )
  }

  return (
    <div className={`relative group ${containerClassName}`}>
      <Image
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
      />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
        <Button
          size="default"
          onClick={() => fileInputRef.current?.click()}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-black hover:bg-accent hover:text-white pointer-events-auto"
        >
          <Upload size={16} className="mr-2" />
          Skift billede
        </Button>
      </div>

      {/* Hidden file input that opens directly */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFileSelect}
        className="hidden"
      />

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
