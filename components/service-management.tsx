'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MediaBrowser from '@/components/media-browser'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical, 
  Save, 
  X,
  FolderOpen,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Layers,
  // Service icons
  Syringe,
  Stethoscope,
  Heart,
  Activity,
  Scan,
  FlaskConical,
  Rabbit,
  ShoppingBag,
  Scissors,
  Tag,
  Cat,
  Dog,
  Smile,
  ClipboardList,
  UserPlus,
  FileImage,
  Dumbbell,
  Package,
  Pill,
  Thermometer,
  Eye,
  Ear,
  Bone,
  Brain,
  Droplet,
  Shield,
  Star,
  // Additional icons
  Bandage,
  Baby,
  Bed,
  BedDouble,
  Bird,
  Bug,
  Calendar,
  CalendarCheck,
  Camera,
  CheckCircle,
  Clock,
  Cpu,
  Cross,
  FileText,
  Fish,
  Flame,
  Footprints,
  Gauge,
  Gift,
  HandHeart,
  HeartPulse,
  Home,
  Hospital,
  Hourglass,
  Lightbulb,
  MapPin,
  Megaphone,
  Microscope,
  Moon,
  PawPrint,
  Phone,
  Puzzle,
  Receipt,
  Scale,
  Search,
  Settings,
  Sparkles,
  Squirrel,
  Sun,
  Swords,
  Target,
  TestTube,
  Timer,
  Turtle,
  Umbrella,
  Users,
  Utensils,
  Wallet,
  Waves,
  Wind,
  Wrench,
  Zap
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Service {
  id: string
  slug: string
  title: string
  content: string
  icon: string
  category: string
  sort_order: number
  image_key: string | null
  is_active: boolean
}

// Available icons for services
const availableIcons = [
  // Dyr
  { name: 'Dog', icon: Dog, label: 'Hund' },
  { name: 'Cat', icon: Cat, label: 'Kat' },
  { name: 'Rabbit', icon: Rabbit, label: 'Kanin' },
  { name: 'Bird', icon: Bird, label: 'Fugl' },
  { name: 'Fish', icon: Fish, label: 'Fisk' },
  { name: 'Bug', icon: Bug, label: 'Insekt' },
  { name: 'Squirrel', icon: Squirrel, label: 'Egern' },
  { name: 'Turtle', icon: Turtle, label: 'Skildpadde' },
  { name: 'PawPrint', icon: PawPrint, label: 'Pote' },
  { name: 'Footprints', icon: Footprints, label: 'Fodspor' },
  
  // Medicinsk
  { name: 'Stethoscope', icon: Stethoscope, label: 'Stetoskop' },
  { name: 'Syringe', icon: Syringe, label: 'Sprøjte' },
  { name: 'Pill', icon: Pill, label: 'Medicin' },
  { name: 'Thermometer', icon: Thermometer, label: 'Termometer' },
  { name: 'Heart', icon: Heart, label: 'Hjerte' },
  { name: 'HeartPulse', icon: HeartPulse, label: 'Puls' },
  { name: 'Activity', icon: Activity, label: 'Aktivitet' },
  { name: 'Bandage', icon: Bandage, label: 'Bandage' },
  { name: 'Cross', icon: Cross, label: 'Kors' },
  { name: 'Hospital', icon: Hospital, label: 'Hospital' },
  
  // Diagnostik
  { name: 'Scan', icon: Scan, label: 'Scanning' },
  { name: 'FileImage', icon: FileImage, label: 'Røntgen' },
  { name: 'Microscope', icon: Microscope, label: 'Mikroskop' },
  { name: 'FlaskConical', icon: FlaskConical, label: 'Laboratorie' },
  { name: 'TestTube', icon: TestTube, label: 'Reagensglas' },
  { name: 'Eye', icon: Eye, label: 'Øje' },
  { name: 'Ear', icon: Ear, label: 'Øre' },
  { name: 'Search', icon: Search, label: 'Søg/Undersøg' },
  
  // Anatomi
  { name: 'Bone', icon: Bone, label: 'Knogle' },
  { name: 'Brain', icon: Brain, label: 'Hjerne' },
  { name: 'Droplet', icon: Droplet, label: 'Dråbe/Blod' },
  { name: 'Smile', icon: Smile, label: 'Tænder' },
  
  // Behandling & pleje
  { name: 'Scissors', icon: Scissors, label: 'Saks/Klip' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Fysioterapi' },
  { name: 'HandHeart', icon: HandHeart, label: 'Omsorg' },
  { name: 'Sparkles', icon: Sparkles, label: 'Wellness' },
  { name: 'Bed', icon: Bed, label: 'Seng' },
  { name: 'BedDouble', icon: BedDouble, label: 'Indlæggelse' },
  { name: 'Wrench', icon: Wrench, label: 'Reparation' },
  
  // Produkter & service
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Indkøb' },
  { name: 'Package', icon: Package, label: 'Pakke' },
  { name: 'Tag', icon: Tag, label: 'Mærke/Chip' },
  { name: 'Gift', icon: Gift, label: 'Gave' },
  { name: 'Utensils', icon: Utensils, label: 'Foder' },
  { name: 'Scale', icon: Scale, label: 'Vægt' },
  
  // Administration
  { name: 'ClipboardList', icon: ClipboardList, label: 'Konsultation' },
  { name: 'FileText', icon: FileText, label: 'Dokument' },
  { name: 'Receipt', icon: Receipt, label: 'Kvittering' },
  { name: 'Calendar', icon: Calendar, label: 'Kalender' },
  { name: 'CalendarCheck', icon: CalendarCheck, label: 'Booking' },
  { name: 'Clock', icon: Clock, label: 'Tid' },
  { name: 'Timer', icon: Timer, label: 'Timer' },
  { name: 'Hourglass', icon: Hourglass, label: 'Ventetid' },
  
  // Personer
  { name: 'UserPlus', icon: UserPlus, label: 'Sygeplejerske' },
  { name: 'Users', icon: Users, label: 'Team' },
  { name: 'Baby', icon: Baby, label: 'Hvalp/Killing' },
  
  // Kommunikation
  { name: 'Phone', icon: Phone, label: 'Telefon' },
  { name: 'Megaphone', icon: Megaphone, label: 'Annoncering' },
  { name: 'Lightbulb', icon: Lightbulb, label: 'Tip/Ide' },
  
  // Symboler
  { name: 'Shield', icon: Shield, label: 'Beskyttelse' },
  { name: 'Star', icon: Star, label: 'Stjerne' },
  { name: 'CheckCircle', icon: CheckCircle, label: 'Godkendt' },
  { name: 'Target', icon: Target, label: 'Mål' },
  { name: 'Zap', icon: Zap, label: 'Energi' },
  { name: 'Flame', icon: Flame, label: 'Akut' },
  { name: 'Umbrella', icon: Umbrella, label: 'Forsikring' },
  { name: 'Home', icon: Home, label: 'Hjem' },
  { name: 'MapPin', icon: MapPin, label: 'Lokation' },
  
  // Natur & miljø
  { name: 'Sun', icon: Sun, label: 'Sol' },
  { name: 'Moon', icon: Moon, label: 'Nat/Akut' },
  { name: 'Waves', icon: Waves, label: 'Vand' },
  { name: 'Wind', icon: Wind, label: 'Luft' },
  
  // Teknologi
  { name: 'Camera', icon: Camera, label: 'Foto' },
  { name: 'Cpu', icon: Cpu, label: 'Teknologi' },
  { name: 'Settings', icon: Settings, label: 'Indstillinger' },
  { name: 'Puzzle', icon: Puzzle, label: 'Specialitet' },
  { name: 'Gauge', icon: Gauge, label: 'Måler' },
  { name: 'Wallet', icon: Wallet, label: 'Betaling' },
  { name: 'Swords', icon: Swords, label: 'Kamp/Parasit' },
]

interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

function getIconComponent(iconName: string) {
  const iconConfig = availableIcons.find(i => i.name === iconName)
  if (iconConfig) {
    const IconComponent = iconConfig.icon
    return <IconComponent className="w-5 h-5" />
  }
  return <Stethoscope className="w-5 h-5" />
}

// Helper function to get public URL from Supabase storage
// Only works for full storage paths (containing /), not short site_images keys
function getPublicImageUrl(path: string): string | null {
  if (!path || !path.includes('/')) return null
  const supabase = createClient()
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export default function ServiceManagement() {
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services')
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [showMediaBrowser, setShowMediaBrowser] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  
  // Category editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryFormData, setCategoryFormData] = useState({ slug: '', label: '' })
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    icon: 'Stethoscope',
    category: 'basis',
    image_key: ''
  })

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/service-categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingService(null)
    setSelectedImageUrl(null)
    setFormData({
      slug: '',
      title: '',
      content: '',
      icon: 'Stethoscope',
      category: 'basis',
      image_key: ''
    })
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsCreating(false)
    // Load existing image URL if there is a valid image_key (full storage path with /)
    if (service.image_key && service.image_key.includes('/')) {
      setSelectedImageUrl(getPublicImageUrl(service.image_key))
    } else {
      setSelectedImageUrl(null)
    }
    setFormData({
      slug: service.slug,
      title: service.title,
      content: service.content || '',
      icon: service.icon,
      category: service.category,
      image_key: service.image_key || ''
    })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingService(null)
    setSelectedImageUrl(null)
    setFormData({
      slug: '',
      title: '',
      content: '',
      icon: 'Stethoscope',
      category: 'basis',
      image_key: ''
    })
  }

  const handleMediaSelect = (imagePath: string) => {
    // imagePath is like "images/image-browser/folder/image.jpg"
    // Set the full path as image_key
    console.log('Selected image path:', imagePath)
    const imageUrl = getPublicImageUrl(imagePath)
    console.log('Generated image URL:', imageUrl)
    setFormData({ ...formData, image_key: imagePath })
    setSelectedImageUrl(imageUrl)
    setShowMediaBrowser(false)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_key: '' })
    setSelectedImageUrl(null)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) return

    setSaving(true)
    try {
      if (isCreating) {
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (response.ok) {
          await fetchServices()
          handleCancel()
        }
      } else if (editingService) {
        const response = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (response.ok) {
          await fetchServices()
          handleCancel()
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på, at du vil slette denne ydelse?')) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleDragStart = (e: React.DragEvent, serviceId: string) => {
    setDraggedItem(serviceId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const newServices = [...services]
    const draggedIndex = newServices.findIndex(s => s.id === draggedItem)
    const targetIndex = newServices.findIndex(s => s.id === targetId)

    const [removed] = newServices.splice(draggedIndex, 1)
    newServices.splice(targetIndex, 0, removed)

    setServices(newServices)
    setDraggedItem(null)

    // Save new order
    try {
      await fetch('/api/services/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newServices.map(s => s.id) })
      })
    } catch (error) {
      console.error('Error reordering services:', error)
      fetchServices() // Revert on error
    }
  }

  const getCategoryLabel = (categorySlug: string) => {
    return categories.find(c => c.slug === categorySlug)?.label || categorySlug
  }

  // Category management functions
  const handleCreateCategory = () => {
    setIsCreatingCategory(true)
    setEditingCategory(null)
    setCategoryError(null)
    setCategoryFormData({ slug: '', label: '' })
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCreatingCategory(false)
    setCategoryError(null)
    setCategoryFormData({ slug: category.slug, label: category.label })
  }

  const handleCancelCategory = () => {
    setIsCreatingCategory(false)
    setEditingCategory(null)
    setCategoryError(null)
    setCategoryFormData({ slug: '', label: '' })
  }

  const handleCategoryLabelChange = (label: string) => {
    setCategoryFormData({
      ...categoryFormData,
      label,
      slug: isCreatingCategory ? generateSlug(label) : categoryFormData.slug
    })
  }

  const handleSaveCategory = async () => {
    if (!categoryFormData.label.trim()) return

    setSaving(true)
    setCategoryError(null)
    try {
      if (isCreatingCategory) {
        const response = await fetch('/api/service-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryFormData)
        })
        if (response.ok) {
          await fetchCategories()
          handleCancelCategory()
        }
      } else if (editingCategory) {
        const response = await fetch(`/api/service-categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryFormData)
        })
        if (response.ok) {
          await fetchCategories()
          await fetchServices() // Refresh services to reflect category changes
          handleCancelCategory()
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    // Check if category has services
    const category = categories.find(c => c.id === id)
    if (!category) return

    const servicesInCategory = services.filter(s => s.category === category.slug)
    if (servicesInCategory.length > 0) {
      setCategoryError(`Kan ikke slette kategorien "${category.label}" - den indeholder ${servicesInCategory.length} ydelse${servicesInCategory.length > 1 ? 'r' : ''}. Flyt eller slet først ydelserne.`)
      return
    }

    if (!confirm(`Er du sikker på, at du vil slette kategorien "${category.label}"?`)) return

    try {
      const response = await fetch(`/api/service-categories/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchCategories()
        setCategoryError(null)
      } else {
        const data = await response.json()
        setCategoryError(data.error || 'Der opstod en fejl ved sletning af kategorien')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setCategoryError('Der opstod en fejl ved sletning af kategorien')
    }
  }

  const handleCategoryDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleCategoryDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const newCategories = [...categories]
    const draggedIndex = newCategories.findIndex(c => c.id === draggedItem)
    const targetIndex = newCategories.findIndex(c => c.id === targetId)

    const [removed] = newCategories.splice(draggedIndex, 1)
    newCategories.splice(targetIndex, 0, removed)

    setCategories(newCategories)
    setDraggedItem(null)

    // Save new order
    try {
      await fetch('/api/service-categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newCategories.map(c => c.id) })
      })
    } catch (error) {
      console.error('Error reordering categories:', error)
      fetchCategories() // Revert on error
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors ${
            activeTab === 'services'
              ? 'border-[#f97561] text-[#f97561]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Ydelser
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-[#f97561] text-[#f97561]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Kategorier
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <>
          <div className="flex justify-end mb-4">
            {!isCreating && !editingService && (
              <Button 
                onClick={handleCreate}
                className="bg-[#f97561] hover:bg-[#f97561]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tilføj ydelse
              </Button>
            )}
          </div>

      {/* Services List with Inline Editing */}
      <div className="space-y-2">
        {/* New Service Form - at top when creating */}
        {isCreating && (
          <div className="border border-[#f97561] rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 p-3 bg-[#f97561]/5 border-b border-[#f97561]/20">
              <div className="w-10 h-10 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                <span className="text-[#f97561]">
                  {getIconComponent(formData.icon)}
                </span>
              </div>
              <div className="grow min-w-0">
                <div className="font-medium text-gray-900">Ny ydelse</div>
                <div className="text-sm text-gray-500">Udfyld felterne nedenfor</div>
              </div>
              <ChevronUp className="w-5 h-5 text-[#f97561]" />
            </div>
            
            {/* Inline Edit Form */}
            <div className="p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titel
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="F.eks. Vaccinationer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ikon
                    </label>
                    <Select 
                      value={formData.icon} 
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {getIconComponent(formData.icon)}
                            <span>{availableIcons.find(i => i.name === formData.icon)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {availableIcons.map((iconOption) => (
                          <SelectItem key={iconOption.name} value={iconOption.name}>
                            <div className="flex items-center gap-2">
                              <iconOption.icon className="w-4 h-4 text-[#f97561]" />
                              <span>{iconOption.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indhold (<button type="button" onClick={() => setShowMarkdownHelp(true)} className="text-[#f97561] hover:underline">understøtter Markdown</button>)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-transparent resize-y"
                    placeholder="Beskriv ydelsen her. Du kan bruge **fed tekst** og - punktlister"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billede (valgfri)
                  </label>
                  
                  {(selectedImageUrl || (formData.image_key && formData.image_key.includes('/'))) ? (
                    <div className="flex items-start gap-4">
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedImageUrl || getPublicImageUrl(formData.image_key) || ''}
                          alt="Valgt billede"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', e.currentTarget.src)
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 truncate max-w-48" title={formData.image_key}>
                          {formData.image_key.split('/').pop() || 'Billede'}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMediaBrowser(true)}
                        >
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Skift billede
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Fjern billede
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setShowMediaBrowser(true)}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#f97561] hover:bg-[#f97561]/5 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-sm text-gray-600">Klik for at vælge billede</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !formData.title.trim()}
                    className="bg-[#f97561] hover:bg-[#f97561]/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Gemmer...' : 'Gem'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuller
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {services.length === 0 && !isCreating ? (
          <p className="text-gray-500 text-center py-8">
            Ingen ydelser endnu. Klik på &quot;Tilføj ydelse&quot; for at oprette den første.
          </p>
        ) : (
          services.map((service) => (
            <div key={service.id}>
              {/* Service Row */}
              <div
                draggable={!editingService}
                onDragStart={(e) => handleDragStart(e, service.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, service.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  draggedItem === service.id 
                    ? 'border-[#f97561] opacity-50 bg-gray-50' 
                    : editingService?.id === service.id
                    ? 'border-[#f97561] bg-[#f97561]/5 rounded-b-none'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <GripVertical className={`w-5 h-5 text-gray-400 shrink-0 ${editingService ? 'opacity-30' : 'cursor-grab'}`} />
                
                <div className="w-10 h-10 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#f97561]">
                    {getIconComponent(service.icon)}
                  </span>
                </div>

                <div className="grow min-w-0">
                  <div className="font-medium text-gray-900 truncate">{service.title}</div>
                  <div className="text-sm text-gray-500">{getCategoryLabel(service.category)}</div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {editingService?.id === service.id ? (
                    <ChevronUp className="w-5 h-5 text-[#f97561]" />
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        disabled={isCreating || (editingService !== null && editingService.id !== service.id)}
                        className="text-gray-600 hover:text-[#f97561]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        disabled={isCreating || editingService !== null}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </>
                  )}
                </div>
              </div>

              {/* Inline Edit Form for this service */}
              {editingService?.id === service.id && (
                <div className="p-4 bg-gray-50 border border-t-0 border-[#f97561] rounded-b-lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Titel
                        </label>
                        <Input
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="F.eks. Vaccinationer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kategori
                        </label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.slug} value={cat.slug}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ikon
                        </label>
                        <Select 
                          value={formData.icon} 
                          onValueChange={(value) => setFormData({ ...formData, icon: value })}
                        >
                          <SelectTrigger>
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                {getIconComponent(formData.icon)}
                                <span>{availableIcons.find(i => i.name === formData.icon)?.label}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {availableIcons.map((iconOption) => (
                              <SelectItem key={iconOption.name} value={iconOption.name}>
                                <div className="flex items-center gap-2">
                                  <iconOption.icon className="w-4 h-4 text-[#f97561]" />
                                  <span>{iconOption.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indhold (<button type="button" onClick={() => setShowMarkdownHelp(true)} className="text-[#f97561] hover:underline">understøtter Markdown</button>)
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-transparent resize-y"
                        placeholder="Beskriv ydelsen her. Du kan bruge **fed tekst** og - punktlister"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billede (valgfri)
                      </label>
                      
                      {(selectedImageUrl || (formData.image_key && formData.image_key.includes('/'))) ? (
                        <div className="flex items-start gap-4">
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedImageUrl || getPublicImageUrl(formData.image_key) || ''}
                              alt="Valgt billede"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', e.currentTarget.src)
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-gray-500 truncate max-w-48" title={formData.image_key}>
                              {formData.image_key.split('/').pop() || 'Billede'}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowMediaBrowser(true)}
                            >
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Skift billede
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveImage}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Fjern billede
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => setShowMediaBrowser(true)}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#f97561] hover:bg-[#f97561]/5 transition-colors"
                        >
                          <ImageIcon className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-sm text-gray-600">Klik for at vælge billede</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving || !formData.title.trim()}
                        className="bg-[#f97561] hover:bg-[#f97561]/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Gemmer...' : 'Gem'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuller
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Træk og slip for at ændre rækkefølgen. Ændringer gemmes automatisk.
      </p>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="flex justify-end mb-4">
            {!isCreatingCategory && !editingCategory && (
              <Button 
                onClick={handleCreateCategory}
                className="bg-[#f97561] hover:bg-[#f97561]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tilføj kategori
              </Button>
            )}
          </div>

          {categoryError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {categoryError}
            </div>
          )}

          <div className="space-y-2">
            {/* New Category Form */}
            {isCreatingCategory && (
              <div className="border border-[#f97561] rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 p-3 bg-[#f97561]/5 border-b border-[#f97561]/20">
                  <div className="w-10 h-10 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-[#f97561]" />
                  </div>
                  <div className="grow min-w-0">
                    <div className="font-medium text-gray-900">Ny kategori</div>
                    <div className="text-sm text-gray-500">Udfyld felterne nedenfor</div>
                  </div>
                  <ChevronUp className="w-5 h-5 text-[#f97561]" />
                </div>
                <div className="p-4 space-y-4 bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
                    <Input
                      value={categoryFormData.label}
                      onChange={(e) => handleCategoryLabelChange(e.target.value)}
                      placeholder="F.eks. Specialbehandlinger"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-venligt navn)</label>
                    <Input
                      value={categoryFormData.slug}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                      placeholder="f.eks. specialbehandlinger"
                    />
                    <p className="mt-1 text-xs text-gray-500">Bruges i URL&apos;er og kode. Kun små bogstaver og bindestreger.</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleSaveCategory}
                      disabled={saving || !categoryFormData.label.trim()}
                      className="bg-[#f97561] hover:bg-[#f97561]/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Gemmer...' : 'Gem'}
                    </Button>
                    <Button onClick={handleCancelCategory} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Annuller
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Categories List */}
            {categories.length === 0 && !isCreatingCategory ? (
              <div className="text-center py-8 text-gray-500">
                <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Ingen kategorier endnu</p>
                <p className="text-sm">Opret en kategori for at organisere ydelser</p>
              </div>
            ) : (
              categories.map((category) => {
                const isEditing = editingCategory?.id === category.id
                const servicesCount = services.filter(s => s.category === category.slug).length

                return (
                  <div
                    key={category.id}
                    draggable={!isEditing && !isCreatingCategory}
                    onDragStart={(e) => handleCategoryDragStart(e, category.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleCategoryDrop(e, category.id)}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      isEditing ? 'border-[#f97561]' : 'border-gray-200'
                    } ${draggedItem === category.id ? 'opacity-50' : ''}`}
                  >
                    {/* Category Row */}
                    <div className={`flex items-center gap-3 p-3 ${isEditing ? 'bg-[#f97561]/5' : 'bg-white hover:bg-gray-50'}`}>
                      <div className="cursor-grab text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5 text-[#f97561]" />
                      </div>
                      <div className="grow min-w-0">
                        <div className="font-medium text-gray-900 truncate">{category.label}</div>
                        <div className="text-sm text-gray-500">
                          {category.slug} · {servicesCount} ydelse{servicesCount !== 1 ? 'r' : ''}
                        </div>
                      </div>
                      {!isEditing && !isCreatingCategory && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-gray-400 hover:text-[#f97561] hover:bg-[#f97561]/10 rounded-lg transition-colors"
                            title="Rediger"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Slet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {isEditing && <ChevronUp className="w-5 h-5 text-[#f97561]" />}
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                      <div className="p-4 space-y-4 bg-gray-50 border-t border-[#f97561]/20">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
                          <Input
                            value={categoryFormData.label}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, label: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                          <Input
                            value={categoryFormData.slug}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                          />
                          <p className="mt-1 text-xs text-gray-500">Kun små bogstaver og bindestreger.</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleSaveCategory}
                            disabled={saving || !categoryFormData.label.trim()}
                            className="bg-[#f97561] hover:bg-[#f97561]/90"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Gemmer...' : 'Gem'}
                          </Button>
                          <Button onClick={handleCancelCategory} variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Annuller
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Træk og slip for at ændre rækkefølgen. Ændringer gemmes automatisk.
          </p>
        </>
      )}

      {/* Media Browser Modal */}
      <MediaBrowser
        isOpen={showMediaBrowser}
        onClose={() => setShowMediaBrowser(false)}
        onSelect={handleMediaSelect}
      />

      {/* Markdown Help Modal */}
      {showMarkdownHelp && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4"
          onClick={() => setShowMarkdownHelp(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Markdown formatering</h3>
              <button 
                onClick={() => setShowMarkdownHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Fed tekst</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">**fed tekst**</code>
                <p className="text-gray-500 mt-1">→ <strong>fed tekst</strong></p>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 mb-2">Kursiv tekst</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">*kursiv tekst*</code>
                <p className="text-gray-500 mt-1">→ <em>kursiv tekst</em></p>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 mb-2">Punktliste</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 block whitespace-pre">- Første punkt{'\n'}- Andet punkt{'\n'}- Tredje punkt</code>
                <div className="text-gray-500 mt-1">
                  <p>→</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Første punkt</li>
                    <li>Andet punkt</li>
                    <li>Tredje punkt</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-gray-700 mb-2">Nyt afsnit</p>
                <p className="text-gray-500">Efterlad en tom linje mellem afsnit</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowMarkdownHelp(false)}
              className="w-full mt-6"
            >
              Forstået
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
