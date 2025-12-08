'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  defaultOpen?: boolean
  badge?: string | number
}

export default function CollapsibleSection({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = false,
  badge
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-10 h-10 bg-[#7d1e82]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-[#7d1e82]" />
            </div>
          )}
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h2 
                className="text-xl font-bold"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#2c2524'
                }}
              >
                {title}
              </h2>
              {badge !== undefined && (
                <span className="px-2 py-0.5 bg-[#7d1e82]/10 text-[#7d1e82] text-sm font-medium rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-[#817d7d] mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-[#817d7d]" />
        </div>
      </button>

      {/* Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 pb-8 pt-2 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}
