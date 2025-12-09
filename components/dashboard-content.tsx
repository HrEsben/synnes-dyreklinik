'use client'

import CollapsibleSection from '@/components/collapsible-section'
import UserProfile from '@/components/auth/user-profile'
import TeamManagement from '@/components/team-management'
import FAQManagement from '@/components/faq-management'
import AlertManagement from '@/components/alert-management'
import ServiceManagement from '@/components/service-management'
import PriceManagement from '@/components/price-management'
import { 
  Bell, 
  Briefcase, 
  Users, 
  HelpCircle,
  DollarSign
} from 'lucide-react'

interface Employee {
  id: number
  name: string | null
  position: string | null
  img_url: string | null
  short_link: string | null
  bio: string | null
  education: string | null
  location: string | null
  hobby: string | null
  specialties: string | null
  years_experience: string | null
}

interface SiteAlert {
  id: number
  message: string | null
  is_active: boolean
  alert_type: string
  created_at: string
  updated_at: string
}

interface DashboardContentProps {
  employees: Employee[]
  currentAlert: SiteAlert | null
}

export default function DashboardContent({ employees, currentAlert }: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - User Profile and Alert Management */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <UserProfile />
        </div>
        <AlertManagement initialAlert={currentAlert} />
      </div>

      {/* Right Column - Main Content with Collapsible Sections */}
      <div className="lg:col-span-2 space-y-4">
        <CollapsibleSection
          title="Ydelser"
          description="Administrer klinikkens ydelser og kategorier"
          icon={Briefcase}
          defaultOpen={false}
        >
          <ServiceManagement />
        </CollapsibleSection>

        <CollapsibleSection
          title="Prisliste"
          description="Administrer priser og priskategorier"
          icon={DollarSign}
          defaultOpen={false}
        >
          <PriceManagement />
        </CollapsibleSection>

        <CollapsibleSection
          title="Kollegaer"
          description="Rediger information om klinikkens personale"
          icon={Users}
          defaultOpen={false}
          badge={employees.length}
        >
          <TeamManagement initialEmployees={employees} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Ofte stillede spørgsmål"
          description="Administrer FAQ-sektionen på hjemmesiden"
          icon={HelpCircle}
          defaultOpen={false}
        >
          <FAQManagement />
        </CollapsibleSection>
      </div>
    </div>
  )
}
