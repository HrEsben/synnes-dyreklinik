import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Synnes Dyreklinik',
  description: 'Administrationspanel for Synnes Dyreklinik.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
