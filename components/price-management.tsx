'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Tag
} from 'lucide-react'

// Form component for price items
interface PriceItemFormProps {
  item: PriceItem | null
  categories: PriceCategory[]
  onSave: (formData: ItemFormData) => void
  onCancel: () => void
  saving: boolean
}

type ItemFormData = {
  category_id: string
  name: string
  description: string
  price_from: string
  price_to: string
  price_note: string
}

function PriceItemForm({ item, categories, onSave, onCancel, saving }: PriceItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    category_id: item?.category_id || categories[0]?.id || '',
    name: item?.name || '',
    description: item?.description || '',
    price_from: item?.price_from?.toString() || '',
    price_to: item?.price_to?.toString() || '',
    price_note: item?.price_note || ''
  })

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4 border-2 border-[#f97561]">
      <h3 className="text-lg font-semibold">
        {item ? 'Rediger pris' : 'Opret ny pris'}
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">
          Kategori *
        </label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Ydelse navn *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="F.eks. Konsultation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Beskrivelse
        </label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="F.eks. Inkl. miljøtillæg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Pris fra (kr)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.price_from}
            onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
            placeholder="F.eks. 500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pris til (kr)
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.price_to}
            onChange={(e) => setFormData({ ...formData, price_to: e.target.value })}
            placeholder="F.eks. 800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Prisnote (i stedet for konkret pris)
        </label>
        <Input
          value={formData.price_note}
          onChange={(e) => setFormData({ ...formData, price_note: e.target.value })}
          placeholder="F.eks. Kontakt os for pris"
        />
        <p className="text-xs text-gray-500 mt-1">
          Hvis du udfylder prisnote, vises den i stedet for priserne
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Gemmer...' : 'Gem'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuller
        </Button>
      </div>
    </div>
  )
}

interface PriceCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

interface PriceItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price_from: number | null
  price_to: number | null
  price_note: string | null
  sort_order: number
  is_active: boolean
}

interface PriceItemWithCategory extends PriceItem {
  category?: PriceCategory
}

export default function PriceManagement() {
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')
  const [categories, setCategories] = useState<PriceCategory[]>([])
  const [priceItems, setPriceItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Category editing state
  const [editingCategory, setEditingCategory] = useState<PriceCategory | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })

  // Price item editing state - track by ID instead of single state
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isCreatingItem, setIsCreatingItem] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch('/api/price-categories'),
        fetch('/api/prices')
      ])

      if (categoriesRes.ok) {
        const data = await categoriesRes.json()
        setCategories(data)
      }

      if (itemsRes.ok) {
        const data = await itemsRes.json()
        setPriceItems(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // Category Management
  // ============================================

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsCreatingCategory(true)
    setCategoryFormData({ name: '', slug: '', description: '' })
  }

  const handleEditCategory = (category: PriceCategory) => {
    setEditingCategory(category)
    setIsCreatingCategory(false)
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    })
  }

  const handleSaveCategory = async () => {
    if (!categoryFormData.name.trim()) {
      alert('Navn skal udfyldes')
      return
    }

    setSaving(true)
    try {
      // Auto-generate slug from name
      const autoSlug = categoryFormData.name
        .toLowerCase()
        .trim()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const url = editingCategory 
        ? `/api/price-categories/${editingCategory.id}`
        : '/api/price-categories'
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryFormData.name.trim(),
          slug: autoSlug,
          description: categoryFormData.description.trim() || null
        })
      })

      if (response.ok) {
        await fetchData()
        setEditingCategory(null)
        setIsCreatingCategory(false)
        setCategoryFormData({ name: '', slug: '', description: '' })
      } else {
        const error = await response.json()
        alert(`Fejl: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Fejl ved gemning af kategori')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette denne kategori? Alle priser i kategorien vil også blive slettet.')) {
      return
    }

    try {
      const response = await fetch(`/api/price-categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      } else {
        alert('Fejl ved sletning af kategori')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Fejl ved sletning af kategori')
    }
  }

  const handleCancelCategory = () => {
    setEditingCategory(null)
    setIsCreatingCategory(false)
    setCategoryFormData({ name: '', slug: '', description: '' })
  }

  // ============================================
  // Price Item Management
  // ============================================

  const handleAddItem = () => {
    setEditingItemId(null)
    setIsCreatingItem(true)
  }

  const handleEditItem = (item: PriceItem) => {
    setEditingItemId(item.id)
    setIsCreatingItem(false)
  }

  const handleSaveItem = async (itemId: string, formData: ItemFormData) => {
    if (!formData.name.trim() || !formData.category_id) {
      alert('Navn og kategori skal udfyldes')
      return
    }

    setSaving(true)
    try {
      const url = itemId === 'new' 
        ? '/api/prices'
        : `/api/prices/${itemId}`
      
      const method = itemId === 'new' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: formData.category_id,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price_from: formData.price_from ? parseFloat(formData.price_from) : null,
          price_to: formData.price_to ? parseFloat(formData.price_to) : null,
          price_note: formData.price_note.trim() || null
        })
      })

      if (response.ok) {
        await fetchData()
        setEditingItemId(null)
        setIsCreatingItem(false)
      } else {
        const error = await response.json()
        alert(`Fejl: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Fejl ved gemning af pris')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette denne pris?')) {
      return
    }

    try {
      const response = await fetch(`/api/prices/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
      } else {
        alert('Fejl ved sletning af pris')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Fejl ved sletning af pris')
    }
  }

  const handleCancelItem = () => {
    setEditingItemId(null)
    setIsCreatingItem(false)
  }

  // Get items for a specific category
  const getItemsForCategory = (categoryId: string) => {
    return priceItems.filter(item => item.category_id === categoryId)
  }

  if (loading) {
    return <div className="text-center py-8">Indlæser...</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'items'
              ? 'border-b-2 border-[#f97561] text-[#f97561]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Priser
          </div>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'categories'
              ? 'border-b-2 border-[#f97561] text-[#f97561]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Kategorier
          </div>
        </button>
      </div>

      {/* Price Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleAddItem} disabled={categories.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Tilføj pris
            </Button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Opret først nogle kategorier under &quot;Kategorier&quot; fanen
            </div>
          ) : (
            <>
              {/* Create Form at Top */}
              {isCreatingItem && (
                <PriceItemForm
                  item={null}
                  categories={categories}
                  onSave={(formData: ItemFormData) => handleSaveItem('new', formData)}
                  onCancel={handleCancelItem}
                  saving={saving}
                />
              )}

              {/* Price Items by Category */}
              <div className="space-y-6">
                {categories.map((category) => {
                  const items = getItemsForCategory(category.id)
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                      </div>

                      {items.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Ingen priser i denne kategori endnu
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {items.map((item) => (
                            <div key={item.id}>
                              {editingItemId === item.id ? (
                                <div className="p-4">
                                  <PriceItemForm
                                    item={item}
                                    categories={categories}
                                    onSave={(formData: ItemFormData) => handleSaveItem(item.id, formData)}
                                    onCancel={handleCancelItem}
                                    saving={saving}
                                  />
                                </div>
                              ) : (
                                <div className="p-4 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      {item.description && (
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                      )}
                                      <div className="mt-1 text-sm font-medium text-[#f97561]">
                                        {item.price_note || (
                                          item.price_from && item.price_to && item.price_from !== item.price_to
                                            ? `${item.price_from} - ${item.price_to} kr.`
                                            : item.price_from
                                            ? `${item.price_from} kr.`
                                            : 'Ingen pris sat'
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditItem(item)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteItem(item.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Tilføj kategori
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(isCreatingCategory || editingCategory) && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? 'Rediger kategori' : 'Opret ny kategori'}
              </h3>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Navn *
                </label>
                <Input
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="F.eks. Hund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Beskrivelse
                </label>
                <Input
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="F.eks. Priser for hundebehandlinger"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveCategory} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Gemmer...' : 'Gem'}
                </Button>
                <Button variant="outline" onClick={handleCancelCategory}>
                  <X className="w-4 h-4 mr-2" />
                  Annuller
                </Button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category) => {
              const itemCount = getItemsForCategory(category.id).length
              
              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {itemCount} {itemCount === 1 ? 'pris' : 'priser'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={itemCount > 0}
                        title={itemCount > 0 ? 'Slet alle priser i kategorien først' : 'Slet kategori'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Ingen kategorier endnu. Opret din første kategori for at komme i gang.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
