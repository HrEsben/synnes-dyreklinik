'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

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
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Min profil</h2>
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
          <label className="block text-sm font-medium text-gray-600">Bruger-ID</label>
          <p className="text-gray-500 text-sm font-mono">{user.id}</p>
        </div>
        
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
