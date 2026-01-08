'use client'

import { useEffect, useState, ReactNode } from 'react'
import ServiceCard from '@/components/service-card'
import StickyAnchorNav from '@/components/sticky-anchor-nav'
import Divider from '@/components/divider'
import { 
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
  TestTube,
  LucideDna
} from 'lucide-react'

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

interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

// Map icon names to components
const iconMap: Record<string, ReactNode> = {
  'Syringe': <Syringe className="w-6 h-6 text-white" />,
  'Stethoscope': <Stethoscope className="w-6 h-6 text-white" />,
  'Heart': <Heart className="w-6 h-6 text-white" />,
  'Activity': <Activity className="w-6 h-6 text-white" />,
  'Scan': <Scan className="w-6 h-6 text-white" />,
  'FlaskConical': <FlaskConical className="w-6 h-6 text-white" />,
  'Rabbit': <Rabbit className="w-6 h-6 text-white" />,
  'ShoppingBag': <ShoppingBag className="w-6 h-6 text-white" />,
  'Scissors': <Scissors className="w-6 h-6 text-white" />,
  'Tag': <Tag className="w-6 h-6 text-white" />,
  'Cat': <Cat className="w-6 h-6 text-white" />,
  'Dog': <Dog className="w-6 h-6 text-white" />,
  'Smile': <Smile className="w-6 h-6 text-white" />,
  'ClipboardList': <ClipboardList className="w-6 h-6 text-white" />,
  'UserPlus': <UserPlus className="w-6 h-6 text-white" />,
  'FileImage': <FileImage className="w-6 h-6 text-white" />,
  'Dumbbell': <Dumbbell className="w-6 h-6 text-white" />,
  'Package': <Package className="w-6 h-6 text-white" />,
  'Pill': <Pill className="w-6 h-6 text-white" />,
  'Thermometer': <Thermometer className="w-6 h-6 text-white" />,
  'Eye': <Eye className="w-6 h-6 text-white" />,
  'Ear': <Ear className="w-6 h-6 text-white" />,
  'Bone': <Bone className="w-6 h-6 text-white" />,
  'Brain': <Brain className="w-6 h-6 text-white" />,
  'Droplet': <Droplet className="w-6 h-6 text-white" />,
  'Shield': <Shield className="w-6 h-6 text-white" />,
  'Star': <Star className="w-6 h-6 text-white" />,
  'TestTube': <TestTube className="w-6 h-6 text-white" />,
  'LucideDna': <LucideDna className="w-6 h-6 text-white" />,
}

// Small icons for navigation
const smallIconMap: Record<string, ReactNode> = {
  'Syringe': <Syringe className="w-4 h-4" />,
  'Stethoscope': <Stethoscope className="w-4 h-4" />,
  'Heart': <Heart className="w-4 h-4" />,
  'Activity': <Activity className="w-4 h-4" />,
  'Scan': <Scan className="w-4 h-4" />,
  'FlaskConical': <FlaskConical className="w-4 h-4" />,
  'Rabbit': <Rabbit className="w-4 h-4" />,
  'ShoppingBag': <ShoppingBag className="w-4 h-4" />,
  'Scissors': <Scissors className="w-4 h-4" />,
  'Tag': <Tag className="w-4 h-4" />,
  'Cat': <Cat className="w-4 h-4" />,
  'Dog': <Dog className="w-4 h-4" />,
  'Smile': <Smile className="w-4 h-4" />,
  'ClipboardList': <ClipboardList className="w-4 h-4" />,
  'UserPlus': <UserPlus className="w-4 h-4" />,
  'FileImage': <FileImage className="w-4 h-4" />,
  'Dumbbell': <Dumbbell className="w-4 h-4" />,
  'Package': <Package className="w-4 h-4" />,
  'Pill': <Pill className="w-4 h-4" />,
  'Thermometer': <Thermometer className="w-4 h-4" />,
  'Eye': <Eye className="w-4 h-4" />,
  'Ear': <Ear className="w-4 h-4" />,
  'Bone': <Bone className="w-4 h-4" />,
  'Brain': <Brain className="w-4 h-4" />,
  'Droplet': <Droplet className="w-4 h-4" />,
  'Shield': <Shield className="w-4 h-4" />,
  'Star': <Star className="w-4 h-4" />,
  'TestTube': <TestTube className="w-4 h-4" />,
  'LucideDna': <LucideDna className="w-4 h-4" />,
}

interface DynamicServicesProps {
  isAuthenticated: boolean
  initialServices?: Service[]
}

// Convert Markdown-style content to HTML
function markdownToHtml(content: string): string {
  if (!content) return ''
  
  return content
    // Bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Line breaks for paragraphs
    .split('\n\n')
    .map(paragraph => {
      // Check if paragraph is a list
      if (paragraph.trim().startsWith('- ')) {
        const items = paragraph
          .split('\n')
          .filter(line => line.trim().startsWith('- '))
          .map(line => `<li>${line.trim().substring(2)}</li>`)
          .join('')
        return `<ul class="list-disc ml-6 mb-4">${items}</ul>`
      }
      return `<p class="mb-4">${paragraph.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}

export default function DynamicServices({ isAuthenticated, initialServices }: DynamicServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!initialServices || initialServices.length === 0)

  useEffect(() => {
    fetchCategories()
    if (!initialServices || initialServices.length === 0) {
      fetchServices()
    }
  }, [initialServices])

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

  // Sort services by category order, then by their own sort_order
  const sortedServices = [...services].sort((a, b) => {
    const catA = categories.find(c => c.slug === a.category)
    const catB = categories.find(c => c.slug === b.category)
    
    const catOrderA = catA?.sort_order ?? 999
    const catOrderB = catB?.sort_order ?? 999
    
    if (catOrderA !== catOrderB) {
      return catOrderA - catOrderB
    }
    
    return a.sort_order - b.sort_order
  })

  // Prepare navigation items with category
  const navServices = sortedServices.map(service => ({
    id: service.slug,
    label: service.title,
    href: `#${service.slug}`,
    icon: smallIconMap[service.icon] || <Stethoscope className="w-4 h-4" />,
    category: service.category
  }))

  if (loading) {
    return (
      <div className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="animate-pulse space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px] text-center">
          <p className="text-gray-500">Ingen ydelser at vise endnu.</p>
        </div>
      </div>
    )
  }

  // Helper function to generate direct image URL from image_key
  // Only generates URL if imageKey is a full storage path (contains /)
  // Short keys like "service-vaccinationer" are for site_images table lookup
  const getDirectImageUrl = (imageKey: string | null): string | undefined => {
    if (!imageKey) return undefined
    // Only treat as direct storage path if it contains a slash
    if (!imageKey.includes('/')) return undefined
    return `https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/${imageKey}`
  }

  return (
    <>
      {/* Sticky Anchor Navigation Menu */}
      <StickyAnchorNav services={navServices} categories={categories} />

      <Divider />

      {/* Services Section */}
      <section className="py-16 px-4 md:px-6 bg-[#fffaf6]">
        <div className="mx-auto max-w-[1257px]">
          <div className="flex flex-col gap-12">
            {sortedServices.map((service, index) => (
              <ServiceCard 
                key={service.id}
                id={service.slug}
                title={service.title} 
                icon={iconMap[service.icon] || <Stethoscope className="w-6 h-6 text-white" />}
                titleKey={`service_${service.slug}_title`}
                contentKey={`service_${service.slug}_content`}
                directImageUrl={getDirectImageUrl(service.image_key)}
                isAuthenticated={isAuthenticated}
                tiltDirection={index % 2 === 0 ? 'left' : 'right'}
                defaultContent={markdownToHtml(service.content)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
