'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, getImageUrl, deleteImage, getPathFromUrl } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/rich-text-editor'
import MediaBrowser from '@/components/media-browser'
import Link from 'next/link'
import { FolderOpen } from 'lucide-react'

interface Employee {
  id: number
  name: string | null
  position: string | null
  img_url: string | null
  short_link: string | null
  bio: string | null
  education: string | null
  location: string | null
  hobby: string | null
  specialties: string | null
  years_experience: string | null
}

interface TeamManagementProps {
  initialEmployees: Employee[]
}

export default function TeamManagement({ initialEmployees }: TeamManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    img_url: '',
    short_link: '',
    bio: '',
    education: '',
    location: '',
    hobby: '',
    specialties: '',
    years_experience: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<number | null>(null)
  const [showMediaBrowser, setShowMediaBrowser] = useState(false)
  const supabase = createClient()

  // Convert HEIC/HEIF files to JPEG
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (!file.type.includes('heic') && !file.type.includes('heif') && !file.name.toLowerCase().includes('.heic')) {
      return file // Return original if not HEIC
    }

    try {
      setConverting(true)
      
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
      setConverting(false)
    }
  }

  // Generate short link from name
  const generateShortLink = (name: string): string => {
    if (!name) return ''
    
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[æøå]/g, (match) => {
        const replacements: { [key: string]: string } = { 'æ': 'ae', 'ø': 'oe', 'å': 'aa' }
        return replacements[match] || match
      })
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      img_url: '',
      short_link: '',
      bio: '',
      education: '',
      location: '',
      hobby: '',
      specialties: '',
      years_experience: ''
    })
    setSelectedFile(null)
    setEditingEmployee(null)
  }

  // Handle media selection from bucket
  const handleMediaSelection = (imagePath: string) => {
    const imageUrl = getImageUrl(imagePath)
    setFormData(prev => ({ ...prev, img_url: imageUrl }))
    setSelectedFile(null) // Clear any selected file
    setShowMediaBrowser(false)
  }

  // Open modal for creating new employee
  const handleCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // Open modal for editing existing employee
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    const shortLink = employee.short_link || generateShortLink(employee.name || '')
    setFormData({
      name: employee.name || '',
      position: employee.position || '',
      img_url: employee.img_url || '',
      short_link: shortLink,
      bio: employee.bio || '',
      education: employee.education || '',
      location: employee.location || '',
      hobby: employee.hobby || '',
      specialties: employee.specialties || '',
      years_experience: employee.years_experience || ''
    })
    setIsModalOpen(true)
  }

  // Delete employee
  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Er du sikker på du vil slette ${employee.name}?`)) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employee.id)

      if (error) throw error

      setEmployees(prev => prev.filter(emp => emp.id !== employee.id))
      alert('Teammedlem slettet!')
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Fejl ved sletning af teammedlem')
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = async (): Promise<string | null> => {
    if (!selectedFile) return formData.img_url || null

    setUploading(true)
    try {
      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `images/team/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const uploadResult = await uploadImage(selectedFile, fileName)
      if (!uploadResult) {
        throw new Error('Failed to upload image')
      }

      const imageUrl = getImageUrl(fileName)
      return imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Fejl ved upload af billede')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Save employee (create or update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Handle image deletion if user removed the image
      let imageUrl: string | null = formData.img_url

      // If editing and there's an old image, and either no new file selected or image was explicitly removed
      if (editingEmployee && editingEmployee.img_url && (!selectedFile && !formData.img_url)) {
        // Delete the old image from storage
        const oldImagePath = getPathFromUrl(editingEmployee.img_url)
        if (oldImagePath) {
          await deleteImage(oldImagePath)
        }
        imageUrl = null
      }
      // If new file is selected, upload it
      else if (selectedFile) {
        // If replacing an existing image, delete the old one first
        if (editingEmployee && editingEmployee.img_url && editingEmployee.img_url !== formData.img_url) {
          const oldImagePath = getPathFromUrl(editingEmployee.img_url)
          if (oldImagePath) {
            await deleteImage(oldImagePath)
          }
        }
        
        imageUrl = await handleImageUpload()
        if (!imageUrl) {
          // If we tried to upload but failed, don't proceed
          return
        }
      }

      // Save the bio as plain text
      const bioText = formData.bio || null

      const employeeData = {
        name: formData.name || null,
        position: formData.position || null,
        img_url: imageUrl,
        short_link: formData.short_link || null,
        bio: bioText,
        education: formData.education || null,
        location: formData.location || null,
        hobby: formData.hobby || null,
        specialties: formData.specialties || null,
        years_experience: formData.years_experience || null
      }
      if (editingEmployee) {
        // Update existing employee
        const { data, error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', editingEmployee.id)
          .select()
          .single()

        if (error) throw error

        setEmployees(prev => prev.map(emp => 
          emp.id === editingEmployee.id ? data : emp
        ))
        
        // Trigger pulse animation for the updated employee
        setRecentlyUpdatedId(editingEmployee.id)
        setTimeout(() => setRecentlyUpdatedId(null), 2000) // Clear after 2 seconds
      } else {
        // Create new employee
        const { data, error } = await supabase
          .from('employees')
          .insert(employeeData)
          .select()
          .single()

        if (error) throw error

        setEmployees(prev => [...prev, data])
        
        // Trigger pulse animation for the new employee
        setRecentlyUpdatedId(data.id)
        setTimeout(() => setRecentlyUpdatedId(null), 2000) // Clear after 2 seconds
      }

      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Fejl ved gemning af teammedlem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-end mb-6">
        <Button size="default" onClick={handleCreate} className="w-full sm:w-auto">
          Tilføj ny medarbejder
        </Button>
      </div>

        {employees && employees.length > 0 ? (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div 
                key={employee.id} 
                className={`border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200 overflow-hidden ${
                  recentlyUpdatedId === employee.id 
                    ? 'bg-green-50 border-green-200 animate-pulse' 
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 min-w-0 flex-1 max-w-full">
                    {employee.img_url && (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image 
                          src={employee.img_url} 
                          alt={employee.name || 'Team member'}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center top' }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 max-w-xs">
                      <h3 className="font-semibold text-lg truncate overflow-hidden text-ellipsis whitespace-nowrap" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: '#2c2524'
                      }} title={employee.name || 'Unavngivet'}>
                        {employee.name || 'Unavngivet'}
                      </h3>
                      <p className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: '#817d7d' }} title={employee.position || 'Ingen stilling'}>
                        {employee.position || 'Ingen stilling'}
                      </p>
                      {employee.short_link ? (
                        <div className="text-xs mt-1">
                          <Link 
                            href={`/om/${employee.short_link}`}
                            className="text-[#f97561] hover:text-[#e85a47] hover:translate-x-1 transition-all duration-300 font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Se profil
                          </Link>
                        </div>
                      ) : (
                        <p className="text-xs mt-1" style={{ color: '#817d7d' }}>
                          Intet link
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(employee)}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      Rediger
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                      onClick={() => handleDelete(employee)}
                      disabled={loading}
                    >
                      Slet
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-6" style={{
              color: '#817d7d',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Ingen teammedlemmer fundet.
            </p>
            <Button size="lg" onClick={handleCreate} className="w-full sm:w-auto">
              Tilføj første medlem
            </Button>
          </div>
        )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[70] p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6" style={{
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              color: '#2c2524'
            }}>
              {editingEmployee ? 'Rediger medarbejder' : 'Tilføj ny medarbejder'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
                  Navn
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value
                    setFormData(prev => ({ 
                      ...prev, 
                      name: newName,
                      short_link: generateShortLink(newName)
                    }))
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                  placeholder="Indtast navn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
                  Stilling
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                  placeholder="Indtast stilling"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
                  Profilbillede
                </label>
                <div className="space-y-3">
                  {/* Current image preview */}
                  {(formData.img_url || selectedFile) && (
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {selectedFile ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center top' }}
                          />
                        ) : (
                          <Image 
                            src={formData.img_url!} 
                            alt="Preview"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center top' }}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        {selectedFile && (
                          <span className="text-sm text-gray-600 block">
                            {selectedFile.name}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            setFormData(prev => ({ ...prev, img_url: '' }))
                            // Reset the file input
                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                        >
                          Fjern billede
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* File input */}
                  <div className="space-y-3">
                    {/* File upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            try {
                              // Convert HEIC to JPEG if needed
                              const convertedFile = await convertHeicToJpeg(file)
                              setSelectedFile(convertedFile)
                            } catch (error) {
                              console.error('File conversion error:', error)
                              alert(error instanceof Error ? error.message : 'Fejl ved konvertering af fil')
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2c2524] hover:bg-gray-50 transition-colors"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <div className="text-center">
                          {converting ? (
                            <div className="mx-auto h-8 w-8 mb-2 animate-spin rounded-full border-2 border-gray-300 border-t-[#2c2524]"></div>
                          ) : (
                            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          )}
                          <span className="text-sm font-medium" style={{ color: '#2c2524' }}>
                            {converting ? 'Konverterer...' : 'Upload billede'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {converting ? 'HEIC fil konverteres' : 'Eller træk og slip her'}
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Bucket selection button */}
                    <div className="text-center">
                      <span className="text-xs text-gray-500">eller</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMediaBrowser(true)}
                      className="w-full"
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Vælg fra mediarkiv
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Vælg et billede (JPG, PNG, GIF, HEIC). HEIC filer konverteres automatisk. Maks 5MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
                  Short Link (automatisk genereret)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.short_link}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    placeholder="Genereres automatisk fra navn..."
                  />
                  {formData.short_link && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">
                        Personlig side: <span className="font-mono text-blue-600">synnesdyreklinik.dk/om/{formData.short_link}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fakta felter */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3" style={{ color: '#2c2524' }}>
                  Faktaboks (vises på personlig side)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Uddannelse
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                      placeholder="f.eks. Uddannet dyrlæge i 2009"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Bor i
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                      placeholder="f.eks. Kirke Hyllinge"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Fritid/Interesser
                    </label>
                    <input
                      type="text"
                      value={formData.hobby}
                      onChange={(e) => setFormData(prev => ({ ...prev, hobby: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                      placeholder="f.eks. Spejderleder i Skibby"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Specialer
                    </label>
                    <input
                      type="text"
                      value={formData.specialties}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                      placeholder="f.eks. Kirurgi, ortopædi"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1 text-gray-600">
                      Uddannet år (beregner automatisk års erfaring)
                    </label>
                    <select
                      value={formData.years_experience}
                      onChange={(e) => {
                        const graduationYear = e.target.value
                        setFormData(prev => ({ ...prev, years_experience: graduationYear }))
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent"
                    >
                      <option value="">Vælg uddannelsesår</option>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = new Date().getFullYear() - i
                        const experience = new Date().getFullYear() - year
                        return (
                          <option key={year} value={year.toString()}>
                            {year} ({experience} års erfaring)
                          </option>
                        )
                      })}
                    </select>
                    {formData.years_experience && (
                      <p className="text-xs text-gray-500 mt-1">
                        Erfaring: {new Date().getFullYear() - parseInt(formData.years_experience)} år
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c2524' }}>
                  Biografi
                </label>
                <RichTextEditor
                  value={formData.bio}
                  onChange={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  placeholder="Indtast medarbejderens biografi."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || uploading || converting}
                  className="flex-1 order-2 sm:order-1"
                >
                  {converting ? 'Konverterer...' : uploading ? 'Uploader billede...' : loading ? 'Gemmer...' : (editingEmployee ? 'Opdater' : 'Tilføj')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading || uploading || converting}
                  className="flex-1 order-1 sm:order-2"
                >
                  Annuller
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Browser Modal */}
      {showMediaBrowser && (
        <MediaBrowser
          isOpen={showMediaBrowser}
          onClose={() => setShowMediaBrowser(false)}
          onSelect={handleMediaSelection}
        />
      )}
    </div>
  )
}
