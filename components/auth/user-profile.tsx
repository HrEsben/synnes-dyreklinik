'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        // Redirect to front page when signed out
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Refresh the page to clear any editable overlays or cached state
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Logget ind som</h2>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
        >
          Log ud
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">E-mail</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        
        {user.user_metadata?.full_name && (
          <div>
            <label className="block text-sm font-medium text-gray-600">Navn</label>
            <p className="text-gray-900">{user.user_metadata.full_name}</p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-600">Registreret</label>
          <p className="text-gray-500 text-sm">
            {new Date(user.created_at).toLocaleDateString('da-DK')}
          </p>
        </div>
      </div>
    </div>
  )
}
