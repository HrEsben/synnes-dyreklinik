'use client'

import { useState, useEffect } from 'react'
import { FAQSection, FAQItem } from './faq-section'
import { defaultFAQItems } from '@/lib/faq-data'

interface FAQSectionClientProps {
  className?: string
  showTitle?: boolean
  title?: string
  subtitle?: string
}

export function FAQSectionClient({ 
  className, 
  showTitle = true, 
  title = "Ofte stillede spørgsmål", 
  subtitle = "Her finder du svar på de mest almindelige spørgsmål"
}: FAQSectionClientProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQItems)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faqs')
        if (response.ok) {
          const data = await response.json()
          if (data.faqs && data.faqs.length > 0) {
            setFaqs(data.faqs)
          } else {
            // Fallback to default FAQs if no server data
            console.log('No FAQs found on server, using defaults')
            setFaqs(defaultFAQItems)
          }
        } else {
          console.log('Failed to fetch FAQs from server, using defaults')
          setFaqs(defaultFAQItems)
        }
      } catch (error) {
        console.log('Error fetching FAQs, using defaults:', error)
        setFaqs(defaultFAQItems)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  if (loading) {
    return (
      <section className={`py-16 ${className || ''}`}>
        <div className="container mx-auto px-6">
          {showTitle && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <FAQSection 
      items={faqs} 
      className={className}
      showTitle={showTitle}
      title={title}
      subtitle={subtitle}
    />
  )
}
