'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical, 
  Save, 
  X,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react'

interface Category {
  id: string
  slug: string
  label: string
  sort_order: number
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    label: ''
  })

  useEffect(() => {
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
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (label: string) => {
    return label
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleLabelChange = (label: string) => {
    setFormData({
      ...formData,
      label,
      slug: isCreating ? generateSlug(label) : formData.slug
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingCategory(null)
    setError(null)
    setFormData({
      slug: '',
      label: ''
    })
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsCreating(false)
    setError(null)
    setFormData({
      slug: category.slug,
      label: category.label
    })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingCategory(null)
    setError(null)
    setFormData({
      slug: '',
      label: ''
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      const url = editingCategory 
        ? `/api/service-categories/${editingCategory.id}`
        : '/api/service-categories'
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await fetchCategories()
        handleCancel()
      } else {
        const data = await response.json()
        setError(data.error || 'Der opstod en fejl')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      setError('Der opstod en fejl ved gemning')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Er du sikker på, at du vil slette denne kategori?')) return
    setError(null)

    try {
      const response = await fetch(`/api/service-categories/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchCategories()
      } else {
        const data = await response.json()
        setError(data.error || 'Der opstod en fejl ved sletning')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Der opstod en fejl ved sletning')
    }
  }

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId)
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
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-[#f97561]" />
          <h2 className="text-xl font-semibold text-gray-900">Kategorier</h2>
        </div>
        {!isCreating && !editingCategory && (
          <Button 
            onClick={handleCreate}
            className="bg-[#f97561] hover:bg-[#f97561]/90"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tilføj kategori
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Categories List with Inline Editing */}
      <div className="space-y-2">
        {/* New Category Form */}
        {isCreating && (
          <div className="border border-[#f97561] rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 p-3 bg-[#f97561]/5 border-b border-[#f97561]/20">
              <div className="w-8 h-8 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4 text-[#f97561]" />
              </div>
              <div className="grow min-w-0">
                <div className="font-medium text-gray-900">Ny kategori</div>
              </div>
              <ChevronUp className="w-5 h-5 text-[#f97561]" />
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Navn
                    </label>
                    <Input
                      value={formData.label}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      placeholder="F.eks. Forebyggelse"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (intern ID)
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="f.eks. forebyggelse"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !formData.label.trim() || !formData.slug.trim()}
                    className="bg-[#f97561] hover:bg-[#f97561]/90"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Gemmer...' : 'Gem'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuller
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {categories.length === 0 && !isCreating ? (
          <p className="text-gray-500 text-center py-6">
            Ingen kategorier endnu.
          </p>
        ) : (
          categories.map((category) => (
            <div key={category.id}>
              {/* Category Row */}
              <div
                draggable={!editingCategory}
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  draggedItem === category.id 
                    ? 'border-[#f97561] opacity-50 bg-gray-50' 
                    : editingCategory?.id === category.id
                    ? 'border-[#f97561] bg-[#f97561]/5 rounded-b-none'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <GripVertical className={`w-5 h-5 text-gray-400 shrink-0 ${editingCategory ? 'opacity-30' : 'cursor-grab'}`} />
                
                <div className="w-8 h-8 rounded-lg bg-[#f97561]/10 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-4 h-4 text-[#f97561]" />
                </div>

                <div className="grow min-w-0">
                  <div className="font-medium text-gray-900">{category.label}</div>
                  <div className="text-xs text-gray-500">{category.slug}</div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {editingCategory?.id === category.id ? (
                    <ChevronUp className="w-5 h-5 text-[#f97561]" />
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        disabled={isCreating || (editingCategory !== null && editingCategory.id !== category.id)}
                        className="text-gray-600 hover:text-[#f97561]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isCreating || editingCategory !== null}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </>
                  )}
                </div>
              </div>

              {/* Inline Edit Form */}
              {editingCategory?.id === category.id && (
                <div className="p-4 bg-gray-50 border border-t-0 border-[#f97561] rounded-b-lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Navn
                        </label>
                        <Input
                          value={formData.label}
                          onChange={(e) => handleLabelChange(e.target.value)}
                          placeholder="F.eks. Forebyggelse"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slug (intern ID)
                        </label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="f.eks. forebyggelse"
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Slug kan ikke ændres</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving || !formData.label.trim()}
                        className="bg-[#f97561] hover:bg-[#f97561]/90"
                        size="sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Gemmer...' : 'Gem'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
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
        Træk og slip for at ændre rækkefølgen. Kategorier med ydelser kan ikke slettes.
      </p>
    </div>
  )
}
