"use client"

import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FAQItem {
  id: string
  question: string
  answer: string
  order?: number
}

interface FAQSectionProps {
  items: FAQItem[]
  title?: string
  subtitle?: string
  className?: string
  showTitle?: boolean
  editable?: boolean
  onEdit?: (item: FAQItem) => void
  onDelete?: (id: string) => void
  onAdd?: () => void
}

export function FAQSection({
  items,
  title = "Ofte stillede spørgsmål",
  subtitle = "Nedenfor har jeg besvaret nogle de spørgsmål jeg oftest får, når I booker en konsultation.",
  className = "",
  showTitle = true,
  editable = false,
  onEdit,
  onDelete,
  onAdd
}: FAQSectionProps) {
  const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <section className={`py-15 px-4 md:px-6 bg-[#fbfbfb] ${className}`}>
      <div className="mx-auto max-w-[1257px]">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 style={{ 
                fontWeight: 800, 
                fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                lineHeight: '1.51em',
                color: '#2c2524'
              }}>
                {title}
              </h2>
              {editable && onAdd && (
                <button
                  onClick={onAdd}
                  className="bg-[#f97561] text-white px-4 py-2 rounded-lg hover:bg-[#e86850] transition-colors"
                >
                  Tilføj spørgsmål
                </button>
              )}
            </div>
            <p className="text-lg font-semibold text-muted-foreground max-w-2xl mx-auto" style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#817d7d'
            }}>
              {subtitle}
            </p>
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-4">
          {sortedItems.map((item, index) => (
            <AccordionItem 
              key={item.id} 
              value={`item-${item.id}`} 
              className="border border-gray-200 rounded-xl bg-[#fffaf6] overflow-hidden"
            >
              <AccordionTrigger className="w-full p-6 flex items-center justify-between text-left hover:bg-[#f5f0e8] transition-colors duration-200 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center flex-1">
                  <span className="w-8 h-8 bg-[#f97561] rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                    ?
                  </span>
                  <h3 className="font-semibold text-lg text-left" style={{
                    fontFamily: 'Poppins, sans-serif',
                    color: '#2c2524'
                  }}>
                    {item.question}
                  </h3>
                </div>
                {editable && (
                  <div className="flex items-center gap-2 ml-4">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                        className="text-[#f97561] hover:text-[#e86850] transition-colors p-1"
                        title="Rediger"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Er du sikker på, at du vil slette dette spørgsmål?')) {
                            onDelete(item.id)
                          }
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Slet"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </AccordionTrigger>
              <AccordionContent className="p-6">
                <p className="ml-11 text-muted-foreground text-base" style={{
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Ingen spørgsmål endnu.
            </p>
            {editable && onAdd && (
              <button
                onClick={onAdd}
                className="mt-4 bg-[#f97561] text-white px-6 py-3 rounded-lg hover:bg-[#e86850] transition-colors"
              >
                Tilføj det første spørgsmål
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
