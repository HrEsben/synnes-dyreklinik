import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard-content'

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

  // Fetch current alert
  const { data: currentAlert } = await supabase
    .from('site_alerts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen pt-20 bg-[#fffaf6]">
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
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4 md:px-6">
        <div className="mx-auto max-w-[1257px]">
          <DashboardContent 
            employees={employees || []} 
            currentAlert={currentAlert || null} 
          />
        </div>
      </section>
    </div>
  )
}
