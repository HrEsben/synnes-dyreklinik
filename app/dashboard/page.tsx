import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserProfile from '@/components/auth/user-profile'
import TeamManagement from '@/components/team-management'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch team members
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching employees:', error)
  }

  return (
    <div className="min-h-screen pt-30 bg-[#fffaf6]">
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 overflow-hidden">
        <div className="mx-auto max-w-[1257px]">
          <div className="">
            <h1 className="" style={{ 
              fontWeight: 800, 
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontSize: 'clamp(32px, 5vw, 49px)',
              lineHeight: '1.51em',
              color: '#2c2524'
            }}>
              Administration
            </h1>
            <p className="text-lg text-muted-foreground leading-[1.9] max-w-2xl" style={{
              fontFamily: 'Poppins ExtraBold, Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '1.89em',
              color: '#817d7d'
            }}>
            Her kan du redigere indholdet på hjemmesiden.<br /> Hvis du har spørgsmål eller der er noget galt, skal du bare ringe til din lillebror.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <UserProfile />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <TeamManagement initialEmployees={employees || []} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
