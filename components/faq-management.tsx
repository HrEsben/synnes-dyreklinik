"use client"

import React, { useState, useEffect } from "react"
import { FAQItem } from "@/components/faq-section"
import { Button } from "@/components/ui/button"

interface FAQFormData {
  question: string
  answer: string
}

// No props needed for this component currently
// interface FAQManagementProps {}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState<FAQFormData>({ question: "", answer: "" })

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data.faqs || [])
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    }
  }

  // Load FAQs on component mount
  useEffect(() => {
    fetchFaqs()
  }, [])

  const handleAdd = () => {
    setEditingFaq(null)
    setFormData({ question: "", answer: "" })
    setIsFormOpen(true)
  }

  const handleEdit = (faq: FAQItem) => {
    setEditingFaq(faq)
    setFormData({ question: faq.question, answer: faq.answer })
    setIsFormOpen(true)
  }

    const handleDelete = async (id: number) => {
    if (!confirm("Er du sikker på at du vil slette dette spørgsmål?")) return

    setLoading(true)

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFaqs(faqs.filter(faq => faq.id !== id))
      } else {
        alert('Fejl ved sletning af spørgsmål')
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      alert('Fejl ved sletning af spørgsmål')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Både spørgsmål og svar skal udfyldes")
      return
    }

    setLoading(true)

    try {
      if (editingFaq) {
        // Update existing FAQ
        const response = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: formData.question.trim(),
            answer: formData.answer.trim(),
          }),
        })

        if (response.ok) {
          const { faq: updatedFaq } = await response.json()
          setFaqs(faqs.map(faq => 
            faq.id === editingFaq.id ? updatedFaq : faq
          ))
        } else {
          alert('Fejl ved opdatering af spørgsmål')
          return
        }
      } else {
        // Add new FAQ
        const response = await fetch('/api/faqs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: formData.question.trim(),
            answer: formData.answer.trim(),
          }),
        })

        if (response.ok) {
          const { faq: newFaq } = await response.json()
          setFaqs([...faqs, newFaq])
        } else {
          alert('Fejl ved oprettelse af spørgsmål')
          return
        }
      }

      setIsFormOpen(false)
      setFormData({ question: "", answer: "" })
      setEditingFaq(null)
    } catch (error) {
      console.error('Error saving FAQ:', error)
      alert('Fejl ved gemning af spørgsmål')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setFormData({ question: "", answer: "" })
    setEditingFaq(null)
  }

  const moveItem = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id)
    if (currentIndex === -1) return

    const newFaqs = [...faqs]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= newFaqs.length) return

    [newFaqs[currentIndex], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[currentIndex]]
    
    // Update display_order for all items
    const updatedFaqs = newFaqs.map((faq, index) => ({
      ...faq,
      display_order: index + 1
    }))

    setFaqs(updatedFaqs)

    // Update order in database
    try {
      const orderUpdates = updatedFaqs.map((faq, index) => ({
        id: faq.id,
        display_order: index + 1
      }))

      const response = await fetch('/api/faqs/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderUpdates }),
      })

      if (!response.ok) {
        // Revert on error
        setFaqs(faqs)
        alert('Fejl ved opdatering af rækkefølge')
      }
    } catch (error) {
      console.error('Error reordering FAQs:', error)
      // Revert on error
      setFaqs(faqs)
      alert('Fejl ved opdatering af rækkefølge')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <Button size="default" onClick={handleAdd} className="w-full sm:w-auto">
          Tilføj spørgsmål
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingFaq ? "Rediger spørgsmål" : "Tilføj nyt spørgsmål"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium mb-2">
                Spørgsmål
              </label>
              <input
                id="question"
                type="text"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none"
                placeholder="Indtast spørgsmålet..."
                required
              />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium mb-2">
                Svar
              </label>
              <textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f97561] focus:border-[#f97561] outline-none resize-both"
                placeholder="Indtast svaret..."
                rows={5}
                style={{ minHeight: '120px', minWidth: '100%' }}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#f97561] hover:bg-[#e86850]" disabled={loading}>
                {loading ? "Gemmer..." : (editingFaq ? "Gem ændringer" : "Tilføj spørgsmål")}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Annuller
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Ingen spørgsmål endnu. Klik &quot;Tilføj spørgsmål&quot; for at komme i gang.
          </p>
        ) : (
          faqs.map((faq, index) => (
            <div key={faq.id} className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => moveItem(faq.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed w-6 h-6 flex items-center justify-center"
                  title="Flyt op"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(faq.id, 'down')}
                  disabled={index === faqs.length - 1}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed w-6 h-6 flex items-center justify-center"
                  title="Flyt ned"
                >
                  ↓
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#2c2524] mb-1 line-clamp-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faq)}
                  className="text-[#f97561] hover:text-[#e86850] transition-colors p-1"
                  title="Rediger"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Er du sikker på, at du vil slette dette spørgsmål?')) {
                      handleDelete(faq.id)
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Slet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {faqs.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {faqs.length} spørgsmål • Ændringer gemmes automatisk
          </p>
        </div>
      )}
    </div>
  )
}
