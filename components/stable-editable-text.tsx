'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface StableEditableTextProps {
  contentKey: string
  initialContent: string // Server-side pre-fetched content
  className?: string
  style?: React.CSSProperties
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  placeholder?: string
  multiline?: boolean
  allowHtml?: boolean
}

export default function StableEditableText({ 
  contentKey, 
  initialContent, 
  className = '', 
  style = {}, 
  tag = 'p', 
  placeholder,
  multiline = false,
  allowHtml = false
}: StableEditableTextProps) {
  const [content, setContent] = useState(initialContent) // Start with server content
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const supabase = createClient()

  // Only check for authentication, don't reload content
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          content_key: contentKey,
          content: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'content_key'
        })

      if (error) {
        console.error('Error saving content:', error)
        alert('Fejl ved gemning af indhold')
      } else {
        // Show success feedback (green pulse effect)
        const element = inputRef.current || document.querySelector(`[data-content-key="${contentKey}"]`)
        if (element) {
          element.style.background = 'rgba(34, 197, 94, 0.1)'
          element.style.transition = 'background-color 0.3s ease'
          setTimeout(() => {
            element.style.background = ''
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Fejl ved gemning af indhold')
    } finally {
      setLoading(false)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    // Reset content to initial server value or reload from database
    setContent(initialContent)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const TagComponent = tag
  const isUserLoggedIn = !!user

  if (isEditing && isUserLoggedIn) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full border border-gray-300 rounded-md px-2 py-1 ${className}`}
            style={style}
            placeholder={placeholder}
            rows={4}
            autoFocus
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full border border-gray-300 rounded-md px-2 py-1 ${className}`}
            style={style}
            placeholder={placeholder}
            autoFocus
          />
        )}
        
        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <TagComponent
      className={`${className} ${isUserLoggedIn ? 'cursor-pointer hover:bg-gray-50 rounded transition-colors' : ''}`}
      style={style}
      onClick={() => isUserLoggedIn && setIsEditing(true)}
      data-content-key={contentKey}
      dangerouslySetInnerHTML={allowHtml ? { __html: content } : undefined}
    >
      {!allowHtml && content}
    </TagComponent>
  )
}
