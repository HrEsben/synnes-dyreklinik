import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserProfile from '@/components/auth/user-profile'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Velkommen til Synnes Dyreklinik
            </h1>
            <p className="mt-2 text-gray-600">
              Administrer dine aftaler og dit dyrs sundhedsoplysninger
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <UserProfile />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Mine aftaler
                </h2>
                <div className="text-center py-8 text-gray-500">
                  <p>Ingen kommende aftaler fundet.</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Book ny tid
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Mine dyr
                </h2>
                <div className="text-center py-8 text-gray-500">
                  <p>Ingen dyr registreret endnu.</p>
                  <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Registrer dyr
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
