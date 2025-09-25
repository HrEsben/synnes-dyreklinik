import { ReactNode } from 'react'
import EditableText from '@/components/editable-text'
import EditableImage from '@/components/editable-image'

interface ServiceCardProps {
  title: string
  children?: ReactNode
  icon?: ReactNode
  id?: string
  // Editable content props
  titleKey?: string // Key for editable title
  contentKey?: string // Key for editable content
  imageKey?: string // Key for editable image
  fallbackImageSrc?: string // Fallback image URL
  defaultContent?: string // Default content for editable text
  isAuthenticated?: boolean // Whether user is authenticated for editing
  tiltDirection?: 'left' | 'right' // Tilt direction for image
}

export default function ServiceCard({ 
  title, 
  children, 
  icon, 
  id,
  titleKey,
  contentKey,
  imageKey,
  fallbackImageSrc,
  defaultContent,
  isAuthenticated = false,
  tiltDirection
}: ServiceCardProps) {
  // Determine rotation class based on tilt direction
  const rotationClass = tiltDirection === 'left' ? 'rotate-[-6deg]' : 
                       tiltDirection === 'right' ? 'rotate-[6deg]' : '';

  return (
    <div id={id} className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start space-x-4 mb-6">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-[#f97561] bg-opacity-10 rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        {titleKey ? (
          <EditableText
            contentKey={titleKey}
            defaultValue={title}
            tag="h3"
            className="text-2xl lg:text-3xl font-bold text-accent-foreground leading-tight"
          />
        ) : (
          <h3 className="text-2xl lg:text-3xl font-bold text-accent-foreground leading-tight">
            {title}
          </h3>
        )}
      </div>
      
      <div className="prose prose-lg max-w-none text-muted-foreground relative">
        {/* Inline image floating on the right with tilt effect - only show for authenticated users */}
        {imageKey && fallbackImageSrc && isAuthenticated && (
          <div className={`float-right ml-6 mb-4 w-64 lg:w-72 transform ${rotationClass}`}>
            <EditableImage
              imageKey={imageKey}
              fallbackSrc={fallbackImageSrc}
              alt={title}
              width={288}
              height={216}
              className="w-full h-40 lg:h-48 object-cover rounded-xl"
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}
        
        {contentKey ? (
          <EditableText
            contentKey={contentKey}
            defaultValue={defaultContent || ''}
            multiline={true}
            allowHtml={true}
            className="prose prose-lg max-w-none text-muted-foreground"
          />
        ) : (
          children
        )}
      </div>
    </div>
  )
}