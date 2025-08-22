'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface EditableTextProps {
  contentKey: string // Unique key for this text content
  defaultValue: string
  className?: string
  style?: React.CSSProperties
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  placeholder?: string
  multiline?: boolean
  allowHtml?: boolean // New prop to enable HTML rendering
}

export default function EditableText({ 
  contentKey, 
  defaultValue, 
  className = '', 
  style = {}, 
  tag = 'p', 
  placeholder,
  multiline = false,
  allowHtml = false
}: EditableTextProps) {
  const [content, setContent] = useState(defaultValue)
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const supabase = createClient()

  // Check if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('content_key', contentKey)
        .single()

      if (data) {
        setContent(data.content)
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error loading content:', error)
      }
    }
    loadContent()
  }, [contentKey, supabase])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    
    try {
      // Upsert content to database with proper conflict resolution
      const { data, error } = await supabase
        .from('site_content')
        .upsert({
          content_key: contentKey,
          content: content,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'content_key'
        })
        .select()

      if (error) {
        console.error('Detailed error saving content:', {
          error,
          contentKey,
          content: content.substring(0, 100) + '...', // First 100 chars
          userId: user.id
        })
        alert(`Error saving content: ${error.message}`)
      } else {
        console.log('Content saved successfully:', data)
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Unexpected error saving content:', err)
      alert('Unexpected error saving content')
    }
    
    setLoading(false)
  }

  const handleCancel = () => {
    setContent(defaultValue)
    setIsEditing(false)
  }

  const handleClick = () => {
    if (user && !isEditing) {
      setIsEditing(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Render editing mode
  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input'
    
    return (
      <div className="relative">
        <InputComponent
          ref={inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`${className} border-2 border-blue-300 rounded px-2 py-1 bg-blue-50 focus:outline-none focus:border-blue-500`}
          placeholder={placeholder}
          disabled={loading}
          style={multiline ? { minHeight: '100px', resize: 'vertical' } : {}}
        />
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    )
  }

  // Render display mode
  const displayContent = content || defaultValue
  const commonProps = {
    className: `${className} ${user ? 'cursor-pointer hover:bg-blue-50 hover:outline-1 hover:outline-blue-300 rounded transition-all' : ''}`,
    style,
    onClick: handleClick,
    title: user ? 'Click to edit' : undefined
  }

  const renderContent = () => {
    if (allowHtml) {
      return { dangerouslySetInnerHTML: { __html: displayContent } }
    } else {
      return { children: displayContent }
    }
  }

  if (tag === 'h1') {
    return <h1 {...commonProps} {...renderContent()} />
  }
  
  if (tag === 'h2') {
    return <h2 {...commonProps} {...renderContent()} />
  }
  
  if (tag === 'h3') {
    return <h3 {...commonProps} {...renderContent()} />
  }
  
  if (tag === 'span') {
    return <span {...commonProps} {...renderContent()} />
  }
  
  return <p {...commonProps} {...renderContent()} />
}
